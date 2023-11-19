import React, { useState } from 'react';
import './Downloade.css';

function Downloade() {
    const [data, setData] = useState({
        url: ''
    });

    const [links, setLinks] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const search = async (event) => {
        event.preventDefault();
        setLinks(data.url);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setLinks('');
    };

    return (
        <div className="container">
            <div className='izquierda'>
                <h1 onClick={() => window.location.reload()} className='title'>Música</h1>

                <form onSubmit={search}>
                    <input
                        required
                        type='text'
                        placeholder='Introduce el titulo de tu canción'
                        onChange={(e) => setData({ ...data, url: e.target.value })}
                    ></input>
                    <button type='submit'>Buscar</button>
                </form>

                {modalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>&times;</span>
                            <iframe
                                id="searchApi"
                                src={`https://api.vevioz.com/apis/search/${links}`}
                                width="100%"
                                height="100%"
                                allowTransparency="true"
                                style={{ border: "none" }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Downloade;
