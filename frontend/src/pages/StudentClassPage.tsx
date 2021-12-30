import {Alert, Button, Col, Input, message, Modal, Row, Typography} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import AceEditor from "react-ace";

import "skulpt";
import {Payload} from "../models/Payload";
import {wsAddress} from "../config";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {studentRole} from "../models/roles";

const {Title} = Typography;

interface ParamTypes {
    id: string;
}

function StudentClassPage() {
    let {id} = useParams<ParamTypes>();

    let lastCode = localStorage.getItem("source_code");
    if (!lastCode) lastCode = "";

    const [sourceCode, setSourceCode] = useState(lastCode);
    const [output, setOutput] = useState("");
    const [executionTime, setExecutionTime] = useState(0.0);
    const [isError, setIsError] = useState(false);
    const [lockRun, setLockRun] = useState(false);

    let savedName = localStorage.getItem("name");
    if (!savedName) savedName = "";

    const [name, setName] = useState(savedName);
    const [tempName, setTempName] = useState(savedName);
    const [isModalVisible, setIsModalVisible] = useState(!savedName);
    const [lastSentCode, setLastSentCode] = useState("");

    const [teacher, setTeacher] = useState(new Payload());

    const socketUrl = `${wsAddress}/ws/${id}`;

    const {
        readyState,
        sendJsonMessage
    } = useWebSocket(socketUrl, {
        onOpen: () => console.log('connection opened'),
        shouldReconnect: (closeEvent) => true,
        onMessage: (m) => {
            try {
                let p = JSON.parse(m.data);
                Object.setPrototypeOf(p, Payload.prototype);
                updateTeacher(p)
            } catch (err) {
                console.log(err);
            }
        }
    });

    const updateTeacher = (t: Payload) => {
        if (t.Role === studentRole) return;
        setTeacher(t);
    }

    const delay = 5;
    const [counter, setCounter] = useState(0);
    const timer = useRef<typeof setInterval>(null);

    useEffect(() => {
        // @ts-ignore
        timer.current = setInterval(() => {
            if (counter > 0) setCounter(counter - 1);
        }, 1000);

        return () => {
            // @ts-ignore
            clearInterval(timer.current);
        };
    });

    useEffect(() => {
        if (!name) {
            setIsModalVisible(true);
        } else {
            let payload = new Payload();
            payload.Role = studentRole;
            payload.SourceCode = sourceCode;
            payload.Name = name;

            // spam protection
            if (!counter && sourceCode !== lastSentCode) {
                console.log("sending " + sourceCode)
                sendJsonMessage(payload);
                setCounter(delay);
                setLastSentCode(sourceCode);
            }
        }
    }, [lastSentCode, counter, name, sendJsonMessage, sourceCode]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'устанавливается...',
        [ReadyState.OPEN]: 'открыто',
        [ReadyState.CLOSING]: 'закрывается...',
        [ReadyState.CLOSED]: 'закрыто',
        [ReadyState.UNINSTANTIATED]: 'не поддерживается',
    }[readyState];

    useEffect(() => {
        // @ts-ignore
        message.info(`Соединение ${connectionStatus}`)
    }, [connectionStatus]);

    let buffer = "";

    function out(text: string) {
        buffer += text;
        setOutput(buffer);
    }

    const run = () => {
        setLockRun(true);
        setOutput("");
        // @ts-ignore
        window.Sk.pre = "output";
        // @ts-ignore
        Sk.configure({output: out});
        let start = performance.now();
        // @ts-ignore
        let myPromise = window.Sk.misceval.asyncToPromise(function () {
            // @ts-ignore
            return window.Sk.importMainWithBody("<stdin>", false, sourceCode, false);
        });
        // @ts-ignore
        myPromise.then(function (mod) {
                let end = performance.now();
                setExecutionTime(end - start);
                setIsError(false);
                setLockRun(false);

                if (buffer === "") setOutput("Программа ничего не вывела на экран");
            },
            // @ts-ignore
            function (err) {
                let end = performance.now();
                setExecutionTime(end - start);
                setIsError(true);
                setOutput(err.toString());
                setLockRun(false);
            });
    }

    return <>
        <Modal title="Нужно представиться" visible={isModalVisible}
               cancelButtonProps={{style: {display: "none"}}}
               closable={false} cancelText={null} onOk={() => {
            setName(tempName);
            setIsModalVisible(false);
            localStorage.setItem("name", tempName);
        }}>
            <Input onChange={(event) => setTempName(event.target.value)} placeholder="Имя Фамилия"/>
        </Modal>
        <Row className="container" style={{paddingTop: "48px"}}>
            <Col xl={11} lg={10} md={8} sm={24} xs={24}>
                <Title level={3}>{tempName}</Title>
                <AceEditor
                    width="auto"
                    height="400px"
                    mode="python"
                    theme="github"
                    onChange={(value => {
                        setSourceCode(value);
                        localStorage.setItem("source_code", value);
                    })}
                    fontSize={16}
                    name="editor"
                    editorProps={{$blockScrolling: true}}
                    defaultValue={sourceCode}
                />
                <br/>
                <Button disabled={lockRun} id="run" onClick={run} type="primary" style={{marginBottom: 24}}>
                    Исполнить
                </Button>
                {output && <Alert message={isError ? "Произошла ошибка" : `Успешно (${executionTime} мс)`}
                                  description={output} style={{whiteSpace: "pre-line"}}
                                  type={isError ? "error" : "success"}/>}
            </Col>
            <Col xl={2} lg={2} md={2}/>
            <Col xl={9} lg={10} md={14} sm={24} xs={24}>
                <Title level={3}>{teacher.Name}</Title>
                <AceEditor
                    width="auto"
                    height="560px"
                    mode="python"
                    theme="github"
                    value={teacher.SourceCode}
                    fontSize={16}
                    name="editor"
                    editorProps={{$blockScrolling: true}}
                    readOnly={true}
                />
                <br/>
            </Col>
        </Row>
    </>
}

export default StudentClassPage;
