import React from 'react'
import Head from 'next/head'
import { useState } from 'react'
import { Row, Col, Table } from 'antd'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Heading,
    Button
} from '@chakra-ui/react'
import axios from 'axios'
import { CSVLink } from 'react-csv'
import styles from '../styles/hectarestatement.module.css'

export default function hectarestatement() {
    const [estateCode, setEstateCode] = useState('')
    const [data, setData] = useState([])

    const columns = [
        {
            title: 'WERKS',
            dataIndex: 'WERKS',
            key: 'WERKS',
            render: (_: any, object: any) => {
                return (
                    <span>{object.WERKS}</span>
                )
            }
        },
        {
            title: 'AFD CODE',
            dataIndex: 'AFD CODE',
            key: 'AFD CODE',
            render: (_: any, object: any) => {
                return (
                    <span>{object.AFD_CODE}</span>
                )
            }
        },
        {
            title: 'BLOCK CODE',
            dataIndex: 'BLOCK CODE',
            key: 'BLOCK CODE',
            render: (_: any, object: any) => {
                return (
                    <span>{object.BLOCK_CODE}</span>
                )
            }
        },
        {
            title: 'BLOCK NAME',
            dataIndex: 'BLOCK NAME',
            key: 'BLOCK NAME',
            render: (_: any, object: any) => {
                return (
                    <span>{object.BLOCK_NAME}</span>
                )
            }
        },
        {
            title: 'PERIODE',
            dataIndex: 'PERIODE',
            key: 'PERIODE',
            render: (_: any, object: any) => {
                return (
                    <span>{object.PERIODE}</span>
                )
            }
        },
        {
            title: 'SOIL',
            dataIndex: 'LAND_TYPE',
            key: 'LAND_TYPE',
            render: (_: any, object: any) => {
                return (
                    <span>{object.LAND_TYPE}</span>
                )
            }
        },
        {
            title: 'TOPOGRAPHY',
            dataIndex: 'TOPOGRAPHY',
            key: 'TOPOGRAPHY',
            render: (_: any, object: any) => {
                return (
                    <span>{object.TOPOGRAPHY}</span>
                )
            }
        },
        {
            title: 'PROGENY',
            dataIndex: 'PROGENY',
            key: 'PROGENY',
            render: (_: any, object: any) => {
                return (
                    <span>{object.PROGENY}</span>
                )
            }
        },
        {
            title: 'LAND_SUIT',
            dataIndex: 'LAND_SUIT',
            key: 'LAND_SUIT',
            render: (_: any, object: any) => {
                return (
                    <span>{object.LAND_SUIT}</span>
                )
            }
        },
        {
            title: 'YOP',
            dataIndex: 'YEAR_PLAN',
            key: 'YEAR_PLAN',
            render: (_: any, object: any) => {
                return (
                    <span>{object.YEAR_PLAN}</span>
                )
            }
        },
        {
            title: 'HECTARES',
            dataIndex: 'HA_SAP',
            key: 'HA_SAP',
            render: (_: any, object: any) => {
                return (
                    <span>{object.HA_SAP?.toFixed(2)}</span>
                )
            }
        },
        {
            title: 'PALMS',
            dataIndex: 'PALM_SAP',
            key: 'PALM_SAP',
            render: (_: any, object: any) => {
                return (
                    <span>{object.PALM_SAP}</span>
                )
            }
        },
        {
            title: 'SPH',
            dataIndex: 'SPH_SAP',
            key: 'SPH_SAP',
            render: (_: any, object: any) => {
                return (
                    <span>{object.SPH_SAP?.toFixed(0)}</span>
                )
            }
        },
    ]


    const getHSdata = async (code: String) => {
        const header = {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HS_TOKEN}`,
            "Content-Type": "application/json"
        };
        axios.get(`${process.env.NEXT_PUBLIC_HS_URL}?val=${code}`, {
            headers: header,
        })
            .then((res) => {
                setData(res.data.data);
                //console.log(res.data)
            })
            .catch(() => console.log("Something error with server"));
    }

    const handleEstateCodeChange = (e: any) => {
        setEstateCode(e.target.value);
        getHSdata(e.target.value);
    }

    const isError = estateCode === ''


    return (
        <div className={styles.main}>
            <Head>
                <title>Portal GIS | Hectarestatement</title>
                <meta name="description" content="Web App of Survey Division TAPG" />
                <link rel="icon" href="/logo-tap.png" />
            </Head>
            <Row style={{ padding: "1rem" }}>
                <Col xl={5} style={{ padding: ".5rem" }}>
                    <Heading as='h4' size='md'>
                        Query Hestate Statement
                    </Heading>
                    <br />
                    <FormControl isInvalid={isError} isRequired>
                        <FormLabel>Estate Code</FormLabel>
                        <Input type='text' value={estateCode} onChange={handleEstateCodeChange} />
                        {!isError ? (
                            <FormHelperText>
                                Enter the Estate Code you'd like to receive the data.
                            </FormHelperText>
                        ) : (
                            <FormErrorMessage>Estate Code is required.</FormErrorMessage>
                        )}
                    </FormControl>
                    <br />
                    {data.length > 1 ? (
                        <CSVLink
                        filename={`HectareStatement_${estateCode}.csv`}
                        data={data}
                        separator={","}>
                            <Button colorScheme='teal' size='md'>
                            Download Data
                        </Button>
                        </CSVLink>
                    ) : null
                    }

                </Col>
                <Col xl={19} style={{ padding: ".5rem" }}>
                    <Heading as='h4' size='md'>
                        Data
                    </Heading>
                    <br />
                    <Table
                        dataSource={data}
                        bordered
                        columns={columns}
                        pagination={{ defaultPageSize: 100, showSizeChanger: true }}
                        scroll={{ y: "75vh" }}
                        rowKey="BLOCK_CODE" />
                </Col>
            </Row>
        </div>
    )
}
