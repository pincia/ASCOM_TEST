import { HubConnectionBuilder } from "@microsoft/signalr";
import React from "react";
import { DataGrid } from '@material-ui/data-grid'
import moment from 'moment'
import Container from 'react-bootstrap/Container'
import { Oval } from 'react-loader-spinner'
import { useState, useEffect } from "react";
import { useAuth } from "../App";
import $ from 'jquery';


export const Patients = () => {

    const [selectedPatient, setSelectedPatient] = useState({});
    const [patients, setPatients] = useState({});
    const [connection, setConnection] = useState({});
    const { onLogout } = useAuth();

    useEffect(() => {

        //centering loader
        $('[data-testid="oval-loading"]').css({
            'margin': 'auto'
        });

        var connection = new HubConnectionBuilder()
            .withUrl("https://localhost:44392/hubs/patients")
            .withAutomaticReconnect()
            .build();

        if (connection) {
            setConnection(connection)
            connection
                .start()
                .then(() => {
                    connection.on("PatientsListMessage", (patients) => {
                        console.log(patients)
                        var _patients = strObjToArray(patients)
                        setPatients(_patients)
                    });
                })
                .catch((error) => console.log(error));
        }
        return () => {
            connection.stop()
        }

    


    }, []);

    const strObjToArray = (str) => {
        var obj = JSON.parse(str);
        var res = [];

        for (var i in obj)
            res.push(obj[i])
        return res
    }

    const selectPatient = (id) => {
        connection.invoke("PatientSelected", id).catch(function (err) {
            return console.error(err.toString());
        });
    }

    var columns = [
        { field: 'Id', headerName: 'ID', width: 90 },
        {
            field: 'FamilyName',
            headerName: 'Family name',
            width: 250,
            sortable: true,
        },
        {
            field: 'GivenName',
            headerName: 'Given name',
            width: 250,
        },
        {
            field: 'LastSelectedDate',
            headerName: 'Last selected date',
            sortable: true,
            width: 250,
            renderCell: (params) => {
                return moment(params.value).format('DD/MM/YYYY HH:mm:ss')
            }
        },
    ];

    return (
        <Container fluid>
            <div class="row">
                <div class="col-md-12 bg-primary" style={{ textAlign: 'right', height: '60px' ,lineHeight: '60px' }}>
                    <button type="button float-right" class="btn btn-warning btn-sm" onClick={onLogout}>Logout</button>
                </div>
            </div>
            <div className="row">
                <div className="col-8">
                    <div style={{ textAlign: 'center', height: '60px', margin: 'auto', lineHeight: '60px', fontSize: '1.5em' }}>
                        PATIENTS TABLE
                    </div>
                    <div class="d-flex justify-content-center patients-container">
                        {
                            (Object.keys(patients).length == 0) ?
                                <Oval
                                    width="100"
                                    color='blue'
                                    ariaLabel='loading'
                                />
                                :
                                <DataGrid
                                    rows={patients}
                                    columns={columns}
                                    pageSize={10}
                                    rowsPerPageOptions={[10]}
                                    getRowId={row => row.Id}
                                    checkboxSelection={false}
                                    onRowClick={(params, event) => {
                                        var selectdPatient = {
                                            id: params.row.Id,
                                            familyName: params.row.FamilyName,
                                            givenName: params.row.GivenName,
                                            lastSelectedDate: moment()
                                        }

                                        selectPatient(params.row.Id)
                                        setSelectedPatient(selectdPatient)
                                    }}
                                />
                        }
                    </div>
                </div>
                <div className="col-4">
                    {
                        (Object.keys(selectedPatient).length == 0) ?
                            <div>
                            </div>
                            :
                            <div>
                                <div style={{ textAlign: 'center', height: '60px', margin: 'auto', lineHeight: '60px', fontSize: '1.5em' }}>
                                    SELECTED PATIENT
                                </div>
                                <div class="card selected-field-container" style={{ height: '400px' }}>
                                    <div className='row ' style={{ height: '33%' }}>
                                          <div className="col-6 selected-field-col">
                                            FAMILY NAME
                                        </div>
                                        <div className='col-6' style={{ lineHeight: '100%', textAlign: 'left', margin: 'auto' }}>
                                            <div className="selected-field border border-primary">
                                                {selectedPatient.familyName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' style={{ height: '33%' }}>
                                        <div className="col-6 selected-field-col">
                                            GIVEN NAME
                                        </div>
                                        <div className='col-6' style={{ lineHeight: '100%', textAlign: 'left', margin: 'auto' }}>
                                            <div className="selected-field border border-primary">
                                                {selectedPatient.givenName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' style={{ height: '33%' }}>
                                    <div className=" col-6 selected-field-col">
                                            <span>LAST SELECTED DATE</span>
                                        </div>
                                        <div className='col-6' style={{ lineHeight: '100%', tetAlign: 'left', margin: 'auto' }}>
                                            <div className="selected-field ">
                                                {moment(selectedPatient.lastSelectedDate).format('DD/MM/YYYY HH:mm:ss')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }

                </div>
            </div>
        </Container>
    )
}

/*
export class Patients extends React.Component {
    constructor(props) {

        super()
        this.state = {
            patients: [],
            selectedPatient:{
                id:-1,
                familyName:'',
                givenName:'',
                lastSelectedDate:''
            }
        }
        this.connection = ''
    }
    componentDidMount() {
        this.connection = new HubConnectionBuilder()
            .withUrl("https://localhost:44392/hubs/patients")
            .withAutomaticReconnect()
            .build();

        if (this.connection) {
            this.connection
                .start()
                .then(() => {
                    this.connection.on("PatientsListMessage", (patients) => {
                        var _patients = this.strObjToArray(patients)
                        this.setState({ 'patients': _patients })
                    });
                })
                .catch((error) => console.log(error));
        }
    }
    strObjToArray(str) {
        var obj = JSON.parse(str);
        var res = [];

        for (var i in obj)
            res.push(obj[i])
        return res
    }
    logout(){
        console.log('LOGOUT')
    }
    render() {

        var columns = [
            { field: 'Id', headerName: 'ID', width: 90 },
            {
                field: 'FamilyName',
                headerName: 'Family name',
                width: 250,
                sortable: true,
            },
            {
                field: 'GivenName',
                headerName: 'Given name',
                width: 250,
            },
            {
                field: 'LastSelectedDate',
                headerName: 'Last selected date',
                sortable: true,
                width: 250,
                renderCell: (params) => {
                    return moment(params.value).format('DD/MM/YYYY HH:mm:ss')
                }
            },
        ];

        return (
            <Container fluid>
                <div class="row">
                    <div class="col-md-12 bg-primary" style={{ textAlign: 'right', height:'60px'}}>
                            <button type="button float-right" class="btn btn-warning btn-sm" onClick={this.logout}>Logout</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <div style={{ textAlign: 'center', height: '60px', margin: 'auto', lineHeight: '60px', fontSize:'1.5em'}}>
                            PATIENTS TABLE
                        </div>
                        <div class="d-flex justify-content-center patients-container">
                            {
                                (Object.keys(this.state.patients).length == 0) ?
                                        <Oval
                                            width="100"
                                            color='blue'
                                            ariaLabel='loading'
                                        />
                                    :
                                    <DataGrid
                                        rows={this.state.patients}
                                        columns={columns}
                                        pageSize={10}
                                        rowsPerPageOptions={[10]}
                                        getRowId={row => row.Id}
                                        checkboxSelection={false}
                                        onRowClick={(params, event) => {
                                            var selectdPatient = {
                                                id:params.row.Id,
                                                familyName: params.row.FamilyName,
                                                givenName: params.row.GivenName,
                                                lastSelectedDate: moment()
                                            }

                                            this.connection.invoke("PatientSelected", params.row.Id).catch(function (err) {
                                                return console.error(err.toString());
                                            });

                                            this.setState({ 'selectedPatient': selectdPatient })
                                       
                                        }}
                                    />
                            }
                         </div>
                    </div>
                    <div className="col-4">
                       {
                            (this.state.selectedPatient.id == -1) ?
                                <div>
                                </div>
                                :
                                <div>
                                    <div style={{ textAlign: 'center', height: '60px', margin: 'auto', lineHeight: '60px', fontSize: '1.5em' }}>
                                        SELECTED PATIENT
                                    </div>
                                    <div class="card selected-field" style={{ height: '400px' }}>
                                        <div className='row ' style={{ height: '33%' }}>
                                            <div className='col-6' style={{ lineHeight: '100%', textAlign: 'center', margin: 'auto' }}>
                                                FAMILY NAME
                                            </div>
                                            <div className='col-6' style={{ lineHeight: '100%', textAlign: 'center', margin: 'auto' }}>
                                                {this.state.selectedPatient.familyName}
                                            </div>
                                        </div>
                                        <div className='row' style={{ height: '33%' }}>
                                            <div className='col-6' style={{ lineHeight: '100%', textAlign: 'center', margin: 'auto' }}>
                                                GIVEN NAME
                                            </div>
                                            <div className='col-6' style={{ lineHeight: '100%', textAlign: 'center', margin: 'auto' }}>
                                                {this.state.selectedPatient.givenName}
                                            </div>
                                        </div>
                                        <div className='row' style={{ height: '33%' }}>
                                            <div className='col-6' style={{ lineHeight: '100%', textAlign: 'center', margin: 'auto' }}>
                                                <span>LAST SELECTED DATE</span>
                                            </div>
                                            <div className='col-6' style={{ lineHeight: '100%', tetAlign: 'center', margin: 'auto' }}>
                                                {moment(this.state.selectedPatient.lastSelectedDate).format('DD/MM/YYYY HH:mm:ss')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                      
                    </div>
                </div>
            </Container>
        )
    }
} */