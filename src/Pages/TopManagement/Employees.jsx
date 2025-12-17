import { useEffect, useState } from "react"
import axios from "axios";
import "./Employees.css";

export default function Employees(){

    const [employee , setEmployee] = useState([]);

    async function getEmployee(){
        const res = await axios.get('/api/users/exclude-top-management');
        setEmployee(res.data.users);
        console.log(res.data.users);
    }

    useEffect(()=>{
        getEmployee();
    },[])

    return(
        <div className="employees-main-container">
            <h1 className="employees-header-title">Employees Management</h1>
            
            <div className="employees-table-wrapper">
                <table className="employees-data-table">
                    <thead className="employees-table-header">
                        <tr>
                            <th className="employees-header-cell">ID</th>
                            <th className="employees-header-cell">Name</th>
                            <th className="employees-header-cell">Email</th>
                            <th className="employees-header-cell">Role</th>
                            <th className="employees-header-cell">Shop</th>
                            <th className="employees-header-cell">Warehouse</th>
                            <th className="employees-header-cell">Created At</th>
                        </tr>
                    </thead>
                    <tbody className="employees-table-body">
                        {employee.length > 0 ? (
                            employee.map((emp) => (
                                <tr key={emp.id} className="employees-data-row">
                                    <td className="employees-data-cell">
                                        <span className="employees-id-badge">{emp.id}</span>
                                    </td>
                                    <td className="employees-data-cell employees-name-cell">{emp.name}</td>
                                    <td className="employees-data-cell employees-email-cell">{emp.email}</td>
                                    <td className="employees-data-cell">
                                        <span className={`employees-role-badge ${
                                            emp.role === 'warehouse_manager' ? 'employees-role-warehouse-manager' :
                                            emp.role === 'warehouse_storekeeper' ? 'employees-role-warehouse-storekeeper' :
                                            emp.role === 'branch_manager' ? 'employees-role-branch-manager' :
                                            emp.role === 'branch_storekeeper' ? 'employees-role-branch-storekeeper' : ''
                                        }`}>
                                            {emp.role.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="employees-data-cell">
                                        {emp.shop ? (
                                            <div className="employees-location-info">
                                                <div className="employees-location-name">{emp.shop.name}</div>
                                                <div className="employees-location-details">
                                                    {emp.shop.location} | {emp.shop.mobile_number}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="employees-na-text">N/A</span>
                                        )}
                                    </td>
                                    <td className="employees-data-cell">
                                        {emp.ware_house ? (
                                            <div className="employees-location-info">
                                                <div className="employees-location-name">{emp.ware_house.name}</div>
                                                <div className="employees-location-details">
                                                    {emp.ware_house.location}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="employees-na-text">N/A</span>
                                        )}
                                    </td>
                                    <td className="employees-data-cell employees-date-cell">
                                        {new Date(emp.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="employees-empty-state">
                                    No employees found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}