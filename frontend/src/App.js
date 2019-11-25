import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Select, Form, Button, Spin } from 'antd';

import './App.css';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const { Option } = Select;

function App(props) {
  const [alunos, setAlunos] = useState([]);
  const [relacoes, setRelacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const { form } = props;

  const submitValues = values => {
    setLoading(true);
    return axios.post('createRelationship', values)
      .finally(() => {
        setLoading(false);
        form.resetFields();
      });
  }

  const getAlunos = async () => {
    return axios.get('listAlunos')
      .then(response => {
        const { data } = response;
        return data;
      });
  }

  const getRelacoes = async () => {
    return axios.get('getRelations', {
      params: {
        label: 'Aluno',
      }
    })
      .then(response => {
        const { data } = response;
        return data;
      });
  }

  const refresh = () => {
    return Promise.all([
      getAlunos(),
      getRelacoes(),
    ]).then(([alunos, relacoes]) => {
      setRelacoes(relacoes);
      setAlunos(alunos);
      setLoading(false);
    })
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        submitValues(values);
        console.log(values);
      }
    });
  };

  const { getFieldDecorator } = form;

  const renderQuery = () => {
    /**
         * MATCH (a:Aluno)
         * WHERE a.ra = 1923293
         * MATCH (b:Aluno)
         * WHERE b.ra = 1923294
         * CREATE (a)-[:FRIENDS_OF]->(b)
         */
    const { getFieldsValue } = form;

    const values = getFieldsValue();
    const { raTo, raFrom, relation } = values;

    const selectedRelation = relacoes.find(relacao => relacao.type === relation) || {};

    return (
      <div>
        <div>
          <span className="green">MATCH </span>
          <span className="blue">(a:Aluno)</span>
        </div>
        <div>
          <span className="green">WHERE </span>
          <span className="blue">a.ra = </span>
          <span className="orange">'{raFrom}'</span>
        </div>
        <div>
          <span className="green">MATCH </span>
          <span className="blue">(a:Aluno)</span>
        </div>
        <div>
          <span className="green">WHERE </span>
          <span className="blue">a.ra = </span>
          <span className="orange">'{raTo}'</span>
        </div>
        <div>
          <span className="green">CREATE </span>
          <span className="blue">(a)-[:{selectedRelation.name || ''}]->(b)</span>
        </div>
      </div>
    )
  };

  return (
    <div className="App" style={{
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Spin spinning={loading}>
        <Form onSubmit={handleSubmit} style={{ width: 300 }}>
          <Form.Item label="Aluno 1">
            {getFieldDecorator('raFrom', {
              rules: [{ required: true, message: 'Insira o aluno 1!' }],
            })(
              <Select>
                {alunos.map(aluno => {
                  return (
                    <Option key={aluno.ra} value={aluno.ra}>
                      {aluno.nome}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Relação">
            {getFieldDecorator('relation', {
              rules: [{ required: true, message: 'Insira a relação!' }],
            })(
              <Select>
                {relacoes.map(relacao => {
                  return (
                    <Option key={relacao.type} value={relacao.type}>
                      {relacao.title}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Aluno 2">
            {getFieldDecorator('raTo', {
              rules: [{ required: true, message: 'Insira o aluno 2!' }],
            })(
              <Select>
                {alunos.map(aluno => {
                  return (
                    <Option key={aluno.ra} value={aluno.ra}>
                      {aluno.nome}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Criar
            </Button>
          </Form.Item>
        </Form>
        {renderQuery()}
      </Spin>
    </div>
  );
}

const WrappedApp = Form.create({ name: 'relations' })(App);

export default WrappedApp;
