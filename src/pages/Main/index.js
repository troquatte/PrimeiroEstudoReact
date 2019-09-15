import React, { Component } from 'react';
import { Link } from 'react-router-dom';

//Icons
import { FaGithubAlt } from 'react-icons/fa';
import { FaPlus, FaSpinner } from 'react-icons/fa';

//Services
import api from '../../service/axios';

//CSS CONTAINER
import Container from '../../Components/Container';

//Css
import { Form, SubmitButton, List } from './styles';


export default class Main extends Component {

  state = {
    newRepo: '',
    repositories: [],
    loading: false
  }

  // Carrega os dados do LocalStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) })
    }
  }

  // Salva os dados do LocalStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }

  }

  //Pega os dados do input quando clicado
  handleInputChange = e => {
    this.setState({ newRepo: e.target.value })
  }

  //Quando enviar o submit busca infos do github
  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true });

    const { newRepo, repositories } = this.state;

    //Verifica se a busca vai dar certa
    try {

      // modelo de busca => rocketseat/unform
      // Api Axios, Get da URL
      const resp = await api.get(`/repos/${newRepo}`);

      // Data para retorno do axios
      const data = {
        name: resp.data.full_name,
      };

      // Atualização do State
      this.setState({
        repositories: [...repositories, data],
        loading: false,
      });

    } catch (e) {
      //Msg Básica de error quando não encontrado os dados
      alert("Nenhum dado encontrado");
      //Atualiza os dados do State
      this.setState({
        loading: false
      });
    }

    //Reseta o valor do form
    this.setState({ newRepo: "" });

  }

  //Render da aplicação
  render() {
    //Const das state
    const { newRepo, loading, repositories } = this.state;

    //Dados HTML
    return (

      //Container
      <Container>

        {/* Title */}
        <h1 className="meu-primeiro-id">
          <FaGithubAlt />
          Repositorios
        </h1>

        {/* Form */}
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={newRepo}
            placeholder="Adicionar repositório"
            onChange={this.handleInputChange}
          />

          {/* Submit Button Loading */}
          <SubmitButton loading={loading ? 1 : 0} block="true">
            {loading ? (
              /* Submit Button Loading False */
              <FaSpinner color="#FFF" size={14} />
            ) : (
                /* Submit Button Loading True */
                <FaPlus color="#FFF" size={14} />
              )}
          </SubmitButton>
          {/* Final Submit Button Loading */}
        </Form>

        {/* List Repositor */}
        <List>
          {repositories.map(r => (
            <li key={r.name}>
              <span>{r.name}</span>
              <Link to={`/repository/${encodeURIComponent(r.name)}`}>Detalhes</Link>
            </li>
          ))}
        </List>
        {/* Final Repositor */}

      </Container >
      //Final Container

    );
  }
}
