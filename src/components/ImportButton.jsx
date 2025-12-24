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
                const finalProductsSheet = workbook.Sheets[workbook.SheetNames[1]];
                const phasesSheet = workbook.Sheets[workbook.SheetNames[2]];
                const deliverablesSheet = workbook.Sheets[workbook.SheetNames[3]];
                const workPackagesSheet = workbook.Sheets[workbook.SheetNames[4]];

                const projectsData = XLSX.utils.sheet_to_json(projectsSheet);
                const finalProductsData = XLSX.utils.sheet_to_json(finalProductsSheet);
                const phasesData = XLSX.utils.sheet_to_json(phasesSheet);
                const deliverablesData = XLSX.utils.sheet_to_json(deliverablesSheet);
                const workPackagesData = workPackagesSheet ? XLSX.utils.sheet_to_json(workPackagesSheet) : [];

                // Map to store IDs to resolve relationships
                const projectMap = {}; // Name -> ID
                const finalProductMap = {}; // Description -> ID
                const phaseMap = {}; // Description -> ID
                const deliverableMap = {}; // Description -> ID

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
                            startDate: p['Start Date'] || '',
                            endDate: p['End Date'] || '',
                            actualStartDate: p['Actual Start Date'] || '',
                            actualEndDate: p['Actual End Date'] || '',
                            kpis: [],
                            risks: []
                        }
                    });
                }

                // 2. Import Final Products
                for (const fp of finalProductsData) {
                    const projectId = projectMap[fp['Project Name']];
                    if (projectId) {
                        const id = uuidv4();
                        finalProductMap[fp.Description] = id;
                        await apiDispatch({
                            type: 'ADD_FINAL_PRODUCT',
                            payload: {
                                id,
                                projectId,
                                description: fp.Description,
                                owner: fp.Owner,
                                budget: { plan: fp.Budget || 0, actual: 0, additional: 0 },
                                startDate: fp['Start Date'] || '',
                                endDate: fp['End Date'] || '',
                                actualStartDate: fp['Actual Start Date'] || '',
                                actualEndDate: fp['Actual End Date'] || '',
                                status: 'Planning'
                            }
                        });
                    }
                }

                // 3. Import Phases
                for (const ph of phasesData) {
                    const finalProductId = finalProductMap[ph['Final Product Description']];
                    if (finalProductId) {
                        const id = uuidv4();
                        phaseMap[ph.Description] = id;
                        await apiDispatch({
                            type: 'ADD_PHASE',
                            payload: {
                                id,
                                finalProductId,
                                description: ph.Description,
                                owner: ph.Owner,
                                budget: { plan: ph.Budget || 0, actual: 0, additional: 0 },
                                startDate: ph['Start Date'] || '',
                                endDate: ph['End Date'] || '',
                                actualStartDate: ph['Actual Start Date'] || '',
                                actualEndDate: ph['Actual End Date'] || '',
                                timeline: ph.Timeline || 'TBD',
                                status: 'Planning'
                            }
                        });
                    }
                }

                // 4. Import Deliverables
                for (const d of deliverablesData) {
                    const phaseId = phaseMap[d['Phase Description']];
                    if (phaseId) {
                        const id = uuidv4();
                        deliverableMap[d.Description] = id;
                        await apiDispatch({
                            type: 'ADD_DELIVERABLE',
                            payload: {
                                id,
                                phaseId,
                                description: d.Description,
                                owner: d.Owner,
                                budget: { plan: d.Budget || 0, actual: 0, additional: 0 },
                                startDate: d['Start Date'] || '',
                                endDate: d['End Date'] || '',
                                actualStartDate: d['Actual Start Date'] || '',
                                actualEndDate: d['Actual End Date'] || '',
                                status: d.Status || 0,
                                completionDate: null
                            }
                        });
                    }
                }

                // 5. Import Work Packages
                for (const wp of workPackagesData) {
                    const deliverableId = deliverableMap[wp['Deliverable Description']];
                    if (deliverableId) {
                        await apiDispatch({
                            type: 'ADD_WORK_PACKAGE',
                            payload: {
                                id: uuidv4(),
                                deliverableId,
                                description: wp.Description,
                                assignee: wp.Assignee || 'Unassigned',
                                budget: { plan: wp.Budget || 0, actual: 0, additional: 0 },
                                startDate: wp['Start Date'] || '',
                                endDate: wp['End Date'] || '',
                                actualStartDate: wp['Actual Start Date'] || '',
                                actualEndDate: wp['Actual End Date'] || '',
                                status: wp.Status || 0
                            }
                        });
                    }
                }

                alert('Import Successful! Data saved to database.');
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
                className="btn btn-outline w-full md:w-auto justify-center"
            >
                <FaFileUpload />
                <span className="btn-text-desktop">Import Excel</span>
            </button>
        </>
    );
};

export default ImportButton;
