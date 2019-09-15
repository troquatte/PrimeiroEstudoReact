import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

//Api
import api from '../../service/axios';

//Css
import { Loading, Owner, IssuesList } from './styles';

//CSS CONTAINER
import Container from '../../Components/Container';


export default class Repository extends Component {
  //PropTypes
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string
      })
    }).isRequired,
  };

  //State
  state = {
    repository: {},
    issues: [],
    loading: true
  };

  //Montando a Página
  async componentDidMount() {

    //Props Url
    const { match } = this.props;
    //Decode Parans
    const repoName = decodeURIComponent(match.params.repository);

    //Promisse ALL
    //Ganhamos velocidade em tempo e melhor entendendimento no código 
    const [repo, iss] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          per_page: 5,
          state: "open"
        }
      })
    ]);

    //Alterando o Stado da Aplicação
    this.setState({
      repository: repo.data,
      issues: iss.data,
      loading: false
    })
  }

  //Render da aplicação
  render() {
    //Const das state
    const { repository, issues, loading } = this.state;

    //Página de Loading  
    if (loading) {
      return <Loading>Carregando...</Loading>;
    }

    //Dados HTML
    return (
      //Container
      <Container>
        {/* Página do repo */}
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        {/* Final Página do repo */}

        <IssuesList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(labels => (
                    <span key={String(labels.id)}>
                      {labels.name}
                    </span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssuesList>
      </Container>
      //Container
    );
    //Final Dados HTML
  }
  //Final Render da aplicação

}
