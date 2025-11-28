import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import { useStore } from '../context/StoreContext';
import { v4 as uuidv4 } from 'uuid';
import { FaFileUpload } from 'react-icons/fa';

const ImportButton = () => {
    const { dispatch: apiDispatch } = useStore();
    const fileInputRef = useRef(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target.result;
                const workbook = XLSX.read(bstr, { type: 'binary' });

                // Parse Sheets
                const projectsSheet = workbook.Sheets[workbook.SheetNames[0]];
                const goalsSheet = workbook.Sheets[workbook.SheetNames[1]];
                const scopesSheet = workbook.Sheets[workbook.SheetNames[2]];
                const deliverablesSheet = workbook.Sheets[workbook.SheetNames[3]];

                const projectsData = XLSX.utils.sheet_to_json(projectsSheet);
                const goalsData = XLSX.utils.sheet_to_json(goalsSheet);
                const scopesData = XLSX.utils.sheet_to_json(scopesSheet);
                const deliverablesData = XLSX.utils.sheet_to_json(deliverablesSheet);

                // Map to store IDs to resolve relationships
                const projectMap = {}; // Name -> ID
                const goalMap = {}; // Description -> ID
                const scopeMap = {}; // Description -> ID

                // 1. Import Projects
                for (const p of projectsData) {
                    const id = uuidv4();
                    projectMap[p.Name] = id;

                    // Parse detailed budget
                    const budget = {
                        plan: parseFloat(p['Budget Plan']) || parseFloat(p.Budget) || 0,
                        actual: parseFloat(p['Budget Actual']) || 0,
                        additional: parseFloat(p['Budget Additional']) || 0
                    };

                    // Parse vendor info
                    const vendor = {
                        name: p['Vendor Name'] || '',
                        contact: p['Vendor Contact'] || '',
                        contractValue: parseFloat(p['Vendor Value']) || 0
                    };

                    // Parse resources
                    const resources = {
                        planManDays: parseFloat(p['Man Days Plan']) || 0,
                        actualManDays: parseFloat(p['Man Days Actual']) || 0
                    };

                    await apiDispatch({
                        type: 'ADD_PROJECT',
                        payload: {
                            id,
                            name: p.Name,
                            description: p.Description,
                            owner: p.Owner,
                            pm: p.PM || '',
                            status: p.Status || 'Planning',
                            businessUnit: p.BusinessUnit,
                            budget,
                            vendor,
                            resources,
                            kpis: [], // Initialize empty KPIs
                            risks: [] // Initialize empty Risks
                        }
                    });
                }

                // 2. Import Goals
                for (const g of goalsData) {
                    const projectId = projectMap[g['Project Name']];
                    if (projectId) {
                        const id = uuidv4();
                        goalMap[g.Description] = id;
                        await apiDispatch({
                            type: 'ADD_GOAL',
                            payload: {
                                id,
                                projectId,
                                description: g.Description,
                                owner: g.Owner,
                                budget: g.Budget || 0,
                                status: 'Planning'
                            }
                        });
                    }
                }

                // 3. Import Scopes
                for (const s of scopesData) {
                    const goalId = goalMap[s['Goal Description']];
                    if (goalId) {
                        const id = uuidv4();
                        scopeMap[s.Description] = id;
                        await apiDispatch({
                            type: 'ADD_SCOPE',
                            payload: {
                                id,
                                goalId,
                                description: s.Description,
                                owner: s.Owner,
                                budget: s.Budget || 0,
                                timeline: s.Timeline || 'TBD',
                                status: 'Planning'
                            }
                        });
                    }
                }

                // 4. Import Deliverables
                for (const d of deliverablesData) {
                    const scopeNames = d['Scope Description(s)'] ? d['Scope Description(s)'].split(',').map(s => s.trim()) : [];
                    const scopeIds = scopeNames.map(name => scopeMap[name]).filter(id => id);

                    if (scopeIds.length > 0) {
                        await apiDispatch({
                            type: 'ADD_DELIVERABLE',
                            payload: {
                                id: uuidv4(),
                                scopeIds,
                                description: d.Description,
                                assignee: d.Assignee || 'Unassigned',
                                owner: d.Owner,
                                budget: d.Budget || 0,
                                status: d.Status || 0,
                                completionDate: null
                            }
                        });
                    }
                }

                alert('Import Successful! Data saved to database.');
                // Reset input
                if (fileInputRef.current) fileInputRef.current.value = '';
            } catch (error) {
                console.error('Import failed:', error);
                alert('Import failed: ' + error.message);
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <>
            <input
                type="file"
                accept=".xlsx, .xls"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileUpload}
            />
            <button
                onClick={() => fileInputRef.current.click()}
                className="btn btn-outline flex items-center gap-2"
            >
                <FaFileUpload /> Import Excel
            </button>
        </>
    );
};

export default ImportButton;
