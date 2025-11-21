import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import { useStore } from '../context/StoreContext';
import { v4 as uuidv4 } from 'uuid';
import { FaFileUpload } from 'react-icons/fa';

const ImportButton = () => {
    const { dispatch } = useStore();
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
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
            projectsData.forEach(p => {
                const id = uuidv4();
                projectMap[p.Name] = id;
                dispatch({
                    type: 'ADD_PROJECT',
                    payload: {
                        id,
                        name: p.Name,
                        description: p.Description,
                        owner: p.Owner,
                        status: p.Status || 'Planning',
                        businessUnit: p.BusinessUnit,
                        budget: p.Budget || 0
                    }
                });
            });

            // 2. Import Goals
            goalsData.forEach(g => {
                const projectId = projectMap[g['Project Name']];
                if (projectId) {
                    const id = uuidv4();
                    goalMap[g.Description] = id;
                    dispatch({
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
            });

            // 3. Import Scopes
            scopesData.forEach(s => {
                const goalId = goalMap[s['Goal Description']];
                if (goalId) {
                    const id = uuidv4();
                    scopeMap[s.Description] = id;
                    dispatch({
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
            });

            // 4. Import Deliverables
            deliverablesData.forEach(d => {
                const scopeNames = d['Scope Description(s)'] ? d['Scope Description(s)'].split(',').map(s => s.trim()) : [];
                const scopeIds = scopeNames.map(name => scopeMap[name]).filter(id => id);

                if (scopeIds.length > 0) {
                    dispatch({
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
            });

            alert('Import Successful!');
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
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
