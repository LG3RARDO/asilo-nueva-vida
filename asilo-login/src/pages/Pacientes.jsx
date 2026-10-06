import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Pacientes() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const token = localStorage.getItem('token');

  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [form, setForm] = useState({
    codigo: '',
    nombres: '',
    fecha_nacimiento: '',
    fecha_ingreso: '',
    motivo_reclusion: '',
    psicopatologia: '',
    estado: 'activo'
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const obtenerPacientes = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/pacientes', { headers });
      setPacientes(res.data);
    } catch (err) {
      setError('Error al obtener pacientes');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerPacientes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:4000/api/pacientes', form, { headers });
      setMensaje('Paciente registrado exitosamente.');
      setError('');
      setForm({
        codigo: '', nombres: '', fecha_nacimiento: '',
        fecha_ingreso: '', motivo_reclusion: '',
        psicopatologia: '', estado: 'activo'
      });
      setMostrarFormulario(false);
      obtenerPacientes();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrar paciente');
      setMensaje('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F4F8' }}>
      <Navbar usuario={usuario} onLogout={handleLogout} />

      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: '#0B2A4A', margin: 0 }}>Gestión de Pacientes</h2>
            <p style={{ color: '#666', margin: '4px 0 0 0' }}>Registro y administración de internos</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '10px 20px', backgroundColor: '#666',
                color: 'white', border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              ← Volver
            </button>
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              style={{
                padding: '10px 20px', backgroundColor: '#0B2A4A',
                color: 'white', border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              {mostrarFormulario ? 'Cancelar' : '+ Nuevo paciente'}
            </button>
          </div>
        </div>

        {/* Mensajes */}
        {mensaje && (
          <div style={{
            backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7',
            borderRadius: '8px', padding: '12px', marginBottom: '16px',
            color: '#065F46', fontSize: '14px'
          }}>
            ✅ {mensaje}
          </div>
        )}
        {error && (
          <div style={{
            backgroundColor: '#FEE2E2', border: '1px solid #F87171',
            borderRadius: '8px', padding: '12px', marginBottom: '16px',
            color: '#B91C1C', fontSize: '14px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Formulario */}
        {mostrarFormulario && (
          <div style={{
            backgroundColor: 'white', borderRadius: '12px',
            padding: '24px', marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ color: '#0B2A4A', marginTop: 0 }}>Registrar nuevo paciente</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Código', name: 'codigo', type: 'text' },
                { label: 'Nombres completos', name: 'nombres', type: 'text' },
                { label: 'Fecha de nacimiento', name: 'fecha_nacimiento', type: 'date' },
                { label: 'Fecha de ingreso', name: 'fecha_ingreso', type: 'date' },
              ].map((campo) => (
                <div key={campo.name}>
                  <label style={{ fontSize: '13px', color: '#444', fontWeight: 'bold' }}>
                    {campo.label}
                  </label>
                  <input
                    type={campo.type}
                    name={campo.name}
                    value={form[campo.name]}
                    onChange={handleChange}
                    style={{
                      width: '100%', padding: '10px', marginTop: '6px',
                      borderRadius: '8px', border: '1px solid #ccc',
                      fontSize: '14px', boxSizing: 'border-box'
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '13px', color: '#444', fontWeight: 'bold' }}>
                  Motivo de reclusión
                </label>
                <textarea
                  name="motivo_reclusion"
                  value={form.motivo_reclusion}
                  onChange={handleChange}
                  rows={3}
                  style={{
                    width: '100%', padding: '10px', marginTop: '6px',
                    borderRadius: '8px', border: '1px solid #ccc',
                    fontSize: '14px', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#444', fontWeight: 'bold' }}>
                  Psicopatología
                </label>
                <textarea
                  name="psicopatologia"
                  value={form.psicopatologia}
                  onChange={handleChange}
                  rows={3}
                  style={{
                    width: '100%', padding: '10px', marginTop: '6px',
                    borderRadius: '8px', border: '1px solid #ccc',
                    fontSize: '14px', boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              style={{
                marginTop: '20px', padding: '12px 28px',
                backgroundColor: '#0B2A4A', color: 'white',
                border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
              }}
            >
              Guardar paciente
            </button>
          </div>
        )}

        {/* Tabla de pacientes */}
        <div style={{
          backgroundColor: 'white', borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0B2A4A' }}>
                {['Código', 'Nombres', 'Fecha ingreso', 'Estado'].map(col => (
                  <th key={col} style={{
                    color: 'white', padding: '14px 16px',
                    textAlign: 'left', fontSize: '13px'
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
                  Cargando pacientes...
                </td></tr>
              ) : pacientes.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
                  No hay pacientes registrados aún.
                </td></tr>
              ) : (
                pacientes.map((p, i) => (
                  <tr key={p.id_paciente} style={{ backgroundColor: i % 2 === 0 ? '#F9FAFB' : 'white' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px' }}>{p.codigo}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px' }}>{p.nombres}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px' }}>{p.fecha_ingreso?.split('T')[0]}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        backgroundColor: p.estado === 'activo' ? '#D1FAE5' : '#FEE2E2',
                        color: p.estado === 'activo' ? '#065F46' : '#B91C1C',
                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold'
                      }}>
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Pacientes;