import React from 'react';
import Head from 'next/head';
import { Row, Col, Space, Button, Table, Modal, Select } from 'antd';
import { Spinner } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Map } from "react-map-gl";
import { Source, Layer } from 'react-map-gl';
import bbox from "@turf/bbox";
import type { MapRef } from 'react-map-gl';
import { Bar } from "react-chartjs-2";
import { useRef } from 'react';
import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatGroup,
} from '@chakra-ui/react';
import { DFLayer, LineLayer } from '../components/map-style';
import styles from '../styles/deforestations.module.css';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Filler,
    Tooltip,
    Legend,
    PointElement
} from "chart.js";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

const { Option } = Select;

export default function deforestations() {
    const [compData, setCompData] = useState([]);
    const [events, setEvents] = useState([]);
    const [cid, setCID] = useState(null);
    const [openCompanyEvent, setOpenCompanyEvent] = useState(false);
    const [aoi, setAOI] = useState(null);
    const [compChart, setCompChart] = useState(null);
    const [Years, setYears] = useState([new Date().getFullYear()]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [DFEvents, setDFEvents] = useState(null);
    const [AllDFEvents, setAllDFEvents] = useState(null);

    const mapRef = useRef<MapRef>();

    const optionsComp = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: `Events of ${selectedYear}`,
            },
        },
    };


    let locale = {
        emptyText: (
            <div><Spinner thickness='4px'
                speed='.5s'
                emptyColor='gray.200'
                color='#8dc53f'
                size='xl' /></div>
        )
    };

    const compcoloumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'COMP_NAME',
            render: (_, object) => {
                return (
                    <span>{object.COMP_NAME}</span>
                )
            }
        },
        {
            title: 'Group Comp',
            dataIndex: 'Group Comp',
            key: 'COMP_GROUP',
            render: (_, object) => {
                return (
                    <span>{object.COMP_GROUP}</span>
                )
            }
        },
        {
            title: 'RSPO',
            dataIndex: 'RSPO',
            key: 'RSPO',
            render: (_, object) => {
                return (
                    <span>{object.RSPO}</span>
                )
            }
        },
        {
            title: 'Total DF (Hectares)',
            dataIndex: 'TOTAL_DF_ALERT',
            key: 'TOTAL_DF_ALERT',
            render: (_, object) => {
                return (
                    <span>{(object.TOTAL_DF_ALERT / 10000).toFixed(2)}</span>
                )
            }
        },
        {
            title: "Action",
            dataIndex: "",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button
                        shape="round"
                        className={record.EVENT_ID}
                        onClick={() => openCompEvent(record.id)}
                        size="small"
                    >
                        Show
                    </Button>
                </Space>
            )
        }
    ];


    const eventcol = [
        {
            title: 'Alert Category',
            dataIndex: 'EVENT_CAT',
            key: 'EVENT_CAT',
            render: (_, object) => {
                return (
                    <span>{object.EVENT_CAT}</span>
                )
            }
        },
        {
            title: 'Company',
            dataIndex: 'EVENT_ID',
            key: 'EVENT_ID',
            render: (_, object) => {
                return (
                    <span>{object.EVENT_ID.split("/")[0]}</span>
                )
            }
        },
        {
            title: 'Alert Date',
            dataIndex: 'ALERT_DATE',
            key: 'ALERT_DATE',
            render: (_, object) => {
                return (
                    <span>{object.ALERT_DATE.split("T")[0]}</span>
                )
            }
        },
        {
            title: 'Area (Hectares)',
            dataIndex: 'AREA',
            key: 'AREA',
            render: (_, object) => {
                return (
                    <span>{(object.AREA / 10000).toFixed(2)}</span>
                )
            }
        },
    ];

    const openCompEvent = (id) => {
        setCID(id);
        setOpenCompanyEvent(true);
    }

    const getCompData = async () => {
        axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/company/`)
            .then((res) => setCompData(res.data))
            .catch((err) => console.log(err));
    }

    const getEvents = async () => {
        axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/deforestationsevents/`)
            .then((res) => {
                setEvents(res.data);
            })
            .catch((err) => console.log(err));
    };

    const getAOI = async (id) => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}geoservices/listcompany/?comp=${id}`)
            .then((res) => {
                setAOI(res.data);
            })
            .catch(() => console.log("Something error with server"));
    };

    const getCompanyChart = async (id) => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}geoservices/deforestations/chart/?comp=${id}&year=${selectedYear}`)
            .then((res) => {
                setCompChart(res.data);
            })
            .catch(() => console.log("Something error with server"));

    }

    const getEventsYears = async () => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}geoservices/events/years/`)
            .then((res) => {
                setYears(res.data.years)
            })
            .catch(() => console.log("Something error with server"));
    }

    const getEventsVector = async (id) => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}geoservices/events/list/company/?comp=${id}&year=${selectedYear}`)
            .then((res) => {
                setDFEvents(res.data);
                const bound = bbox(res.data.features[0])
                mapRef.current?.fitBounds(
                    [
                        [bound[0], bound[1]],
                        [bound[2], bound[3]]
                    ],
                    { padding: 100, duration: 1000 }
                )
            })
            .catch(() => console.log("Something error with server"));

    }

    const getAllEventsVector = async (id) => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}geoservices/events/list/company/?comp=${id}&year=0`)
            .then((res) => {
                setAllDFEvents(res.data);
                //console.log(res.data)
            })
            .catch(() => console.log("Something error with server"));

    };

    const handleChangeYear = (value) => {
        setSelectedYear(value);
    }


    useEffect(() => {
        getCompData()
        getEvents()
        getEventsYears();
    }, [])

    useEffect(() => {
        if (cid) {
            getAOI(cid)
            getCompanyChart(cid)
            getEventsVector(cid)
            getAllEventsVector(cid)
        }
    }, [cid])

    useEffect(() => {
        if (cid) {
            getCompanyChart(cid)
            getEventsVector(cid)
            getAllEventsVector(cid)
        }
    }, [selectedYear])



    //console.log(compData)

    return (
        <div className={styles.container}>
            <Head>
                <title>Portal GIS | Deforestatin Events</title>
                <meta name="description" content="Web App of Survey Division TAPG" />
                <link rel="icon" href="/logo-tap.png" />
            </Head>
            <Row>
                <Col xl={12} style={{
                    padding: ".5rem"
                }}>
                    <Heading as='h4' size='md'>
                        List of Events
                    </Heading>
                    <br />
                    <Table
                        dataSource={events}
                        bordered
                        columns={eventcol}
                        pagination={{ defaultPageSize: 100, showSizeChanger: true }}
                        scroll={{ y: "70vh" }}
                        locale={locale}
                        rowKey="id" />
                </Col>
                <Col xl={12} style={{
                    padding: ".5rem"
                }}>
                    <Heading as='h4' size='md'>
                        List of Companies
                    </Heading>
                    <br />
                    <Table
                        bordered
                        dataSource={compData}
                        columns={compcoloumns}
                        className={styles.headertable}
                        pagination={{ defaultPageSize: 20, showSizeChanger: true }}
                        scroll={{ y: "70vh" }}
                        locale={locale}
                        rowKey="id"
                    />
                </Col>
                <Modal
                    //title="Company Events"
                    open={openCompanyEvent}
                    onOk={() => setOpenCompanyEvent(false)}
                    onCancel={() => setOpenCompanyEvent(false)}
                    width="90%"
                    style={{
                        top: 20,
                    }}
                    footer={null}
                >
                    <Row>

                        <Col xl={14}>

                            <div>
                                <Map
                                    ref={mapRef}
                                    mapStyle={"mapbox://styles/geo-circle/cl28tz8gf005j15jzi1k68m5z"}
                                    initialViewState={{
                                        latitude: 0,
                                        longitude: 117,
                                        zoom: 4,
                                    }}
                                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                                    style={{
                                        position: "absolute",
                                        width: "100%",
                                        top: 0,
                                        left: 0,
                                        bottom: 0
                                    }}
                                >

                                    {DFEvents ?
                                        <Source type="geojson" data={DFEvents} id="DF" >
                                            <Layer {...DFLayer} id="DF" beforeId="vector" />
                                        </Source> : null}

                                    {aoi ?
                                        <Source type="geojson" data={aoi} id="vector" >
                                            <Layer {...LineLayer} id="vector" />
                                        </Source> : null}
                                </Map>
                            </div>
                        </Col>
                        <Col xl={10} style={{ padding: "1rem" }}>
                            <Heading size={'md'}>Events - {aoi?.features[0].properties.COMP_NAME}</Heading>
                            <br />
                            <Space>
                                <Select
                                    defaultValue={selectedYear}
                                    style={{
                                        width: 120,
                                    }}
                                    onChange={handleChangeYear}>
                                    {Years.map((label, idx) => (
                                        <Option key={idx} value={label}>
                                            {label}
                                        </Option>
                                    ))}
                                </Select>
                            </Space>
                            <Row style={{ height: "45vh" }}>
                                {compChart ?
                                    <Bar
                                        options={optionsComp}
                                        data={compChart.data}
                                        style={{ maxHeight: "45vh", marginTop: "2rem" }}
                                    /> : null}
                            </Row>
                            <Row style={{ height: "30vh", padding: "2rem" }}>
                                <Col xl={24}>
                                    <br />
                                    <StatGroup>
                                        <Stat>
                                            <StatLabel>All Alerts</StatLabel>
                                            <StatNumber>{(AllDFEvents?.features.reduce((total, currentValue) => total = total + Number(currentValue.properties.AREA), 0) / 10000).toFixed(2)}</StatNumber>
                                            <StatHelpText>
                                                Hectares
                                            </StatHelpText>
                                        </Stat>
                                        <Stat>
                                            <StatLabel>Alert in {selectedYear}</StatLabel>
                                            <StatNumber>{(DFEvents?.features.reduce((total, currentValue) => total = total + Number(currentValue.properties.AREA), 0) / 10000).toFixed(2)}</StatNumber>
                                            <StatHelpText>
                                                Hectares
                                            </StatHelpText>
                                        </Stat>
                                        <Stat>
                                            <StatLabel>Last Alert</StatLabel>
                                            <StatNumber>{(AllDFEvents?.features[0].properties.AREA / 10000).toFixed(2)}</StatNumber>
                                            <StatHelpText>
                                                Hectares
                                            </StatHelpText>
                                            <StatHelpText>
                                                Date: {(AllDFEvents?.features[0].properties.ALERT_DATE.split("T")[0])}
                                            </StatHelpText>
                                        </Stat>
                                    </StatGroup>
                                    <br />
                                    <Button onClick={() => { }} type="primary" block>Download</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Modal>
            </Row>
        </div>
    )
}
