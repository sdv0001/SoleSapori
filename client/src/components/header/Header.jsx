import React, { useState, useEffect } from "react";
import "../header/Header.scss";
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faGear, faRedo } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../state/index";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Header({ searchRecipes, isHome, handleNavigateHome, handleNavigateProfile }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user._id);
  const [showDropdown, setShowDropdown] = useState(false);
  const [ingredient, setIngredient] = useState('');
  const [regione, setRegione] = useState('');
  const [tipo, setTipo] = useState('');
  const [tempoPreparazione, setTempoPreparazione] = useState('');
  const [difficolta, setDifficolta] = useState('');
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [regions, setRegions] = useState([]);
  const [types, setTypes] = useState([]);
  const [difficulties, setDifficulties] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [regionsRes, typesRes, difficultiesRes] = await Promise.all([
          axios.get("http://localhost:6001/recipes/regions", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:6001/recipes/types", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:6001/recipes/difficulties", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        console.log("Regioni:", regionsRes.data);
        console.log("Tipi:", typesRes.data);
        console.log("Difficoltà:", difficultiesRes.data);
        setRegions(regionsRes.data);
        setTypes(typesRes.data);
        setDifficulties(difficultiesRes.data);
      } catch (error) {
        console.error("Errore nel caricamento dei filtri:", error);
      }
    };

    fetchFilters();
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (ingredient) params.ingredient = ingredient;
    if (regione) params.regione = regione;
    if (tipo) params.tipo = tipo;
    if (tempoPreparazione) params.tempo_preparazione = tempoPreparazione;
    if (difficolta) params.difficolta = difficolta;

    searchRecipes(params);
  };

  const handleReset = () => {
    setIngredient('');
    setRegione('');
    setTipo('');
    setTempoPreparazione('');
    setDifficolta('');
    handleNavigateHome();
    searchRecipes({});
  };

  const userImageUrl = user.picture.startsWith('http') ? user.picture : `http://localhost:6001/assets/${user.picture}`;

  return (
    <div className="header-wrapper">
      <div className="logo-wrapper" onClick={() => handleNavigateHome()}>
        <img src={logo} alt="logo" className="logo-image" />
        <span className="name">Sole & Sapori</span>
      </div>
      {isHome && (
        <form className="input-wrapper" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Ingrediente"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            className="header-input"
          />
          <select
            value={regione}
            onChange={(e) => setRegione(e.target.value)}
            className="header-input"
          >
            <option value="">Regione</option>
            {regions.map((region, index) => (
              <option key={index} value={region}>{region}</option>
            ))}
          </select>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="header-input"
          >
            <option value="">Tipo di Piatto</option>
            {types.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={tempoPreparazione}
            onChange={(e) => setTempoPreparazione(e.target.value)}
            className="header-input"
          >
            <option value="">Tempo</option>
            <option value="0-30">0-30 minuti</option>
            <option value="31-60">31-60 minuti</option>
            <option value="60-">60+ minuti</option>
          </select>
          <select
            value={difficolta}
            onChange={(e) => setDifficolta(e.target.value)}
            className="header-input"
          >
            <option value="">Difficoltà</option>
            {difficulties.map((difficulty, index) => (
              <option key={index} value={difficulty}>{difficulty}</option>
            ))}
          </select>
          <button type="submit" className="search-icon-wrapper">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="search-icon"
            />
          </button>
          <button type="button" className="reset-icon-wrapper" onClick={handleReset}>
            <FontAwesomeIcon
              icon={faRedo}
              className="reset-icon"
            />
          </button>
        </form>
      )}
      <div className="profile-section-wrapper">
        <FontAwesomeIcon
          className="gear-icon"
          icon={faGear}
          onClick={() => {
            setShowDropdown(!showDropdown);
          }}
        />
        <div
          className="profile-settings-wrapper"
          onClick={() => {
            setShowDropdown(!showDropdown);
          }}
        >
          <img
            className="user-image"
            src={userImageUrl}
            alt="user"
          />
          <span className="user-name">
            {user.firstName} {user.lastName}
          </span>
        </div>
        <div className={`dropdown-wrapper ${showDropdown ? "show" : "hide"}`}>
          <span className="dropdown-profile" onClick={() => {
            handleNavigateProfile(userId);
          }}>Profile</span>
          <span className="dropdown-logout" onClick={() => dispatch(setLogout())}>Logout</span>
          {user.role === 'admin' && (
            <span className="dropdown-admin" onClick={() => navigate('/admin')}>Gestione Admin</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
