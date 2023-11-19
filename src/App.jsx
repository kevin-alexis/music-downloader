import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [data, setData] = useState({
    url: ''
  })

  const [links, setLinks] = useState();

  const [recentResults, setRecentResults] = useState([]);

  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem('recentResults')) || [];
    setRecentResults(storedResults);
  }, []); // Solo se ejecuta una vez, al montar el componente

  const search = async (event) => {
    event.preventDefault(); // Evita el envío automático del formulario
    const storedResults = JSON.parse(localStorage.getItem('recentResults')) || [];
    const existingResult = storedResults.find((result) => result.url === data.url);
  
    if (existingResult) {
      setLinks(existingResult);
    } else {
      await getLinks();
    }
  }

  async function getLinks() {

    const url = 'https://youtube-audio-video-download.p.rapidapi.com/geturl?video_url=' + encodeURIComponent(data.url);

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'a4d8f9ff3dmsh0c74da065d212d3p1e01e8jsn22eb760fa0c6',
        'X-RapidAPI-Host': 'youtube-audio-video-download.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json(); // Parsea la respuesta como JSON
      setLinks(result);
  
      if (result && result.thumbnail_url && result.title) {
        setRecentResults(prevRecentResults => {
          const newRecentResults = [
            {
              thumbnail_url: result.thumbnail_url,
              title: result.title,
              audio_high: result.audio_high,
              audio_low: result.audio_low,
              video_high: result.video_high,
              video_low: result.video_low,
              url: data.url // Guardar el URL original
            },
            ...prevRecentResults.filter(recent => recent.url !== data.url) // Evitar duplicados
          ];
  
          localStorage.setItem('recentResults', JSON.stringify(newRecentResults));
          return newRecentResults;
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleRecentResultClick = async (recentResult) => {
    const existingResult = recentResults.find((result) => result.url === recentResult.url);
  
    if (existingResult) {
      setLinks(existingResult);
    } else {
      setData({ url: recentResult.url });
      await getLinks(recentResult);
    }
  };
  

  return (
    
    <div className="container">
      
      <div className='izquierda'>
      <h1>Música</h1>
      {links && (
        <>
        <div>
              <img src={links.thumbnail_url} alt="Thumbnail del video" />
            </div>
            <div>
              <strong>Titulo: </strong><>{links.title}</>
            </div>
        </>
      )}
      
      <form onSubmit={search}>
        <input required type='url' placeholder='Introduce el URL de la canción que deseas descargar' onChange={(e) => setData({ ...data, url: e.target.value })}></input>
        <button type='submit'>Buscar</button>
      </form>
      
      {links && ( // Verifica si links tiene datos antes de intentar mapearlo
        <div className='Enlaces'>
            
          <h2>Enlaces:</h2>
          <ul>
            <li>
              
                <a href={links.audio_high} target="_blank" rel="noopener noreferrer">
                  <button>
                    Audio Alta Calidad
                  </button>
                </a>
              
            </li>
            <li>
              
                <a href={links.audio_low} target="_blank" rel="noopener noreferrer">
                  <button>
                  Audio Baja
                  </button>
                </a>
              
            </li>
            <li>
              
                <a href={links.video_high} target="_blank" rel="noopener noreferrer">
                  <button>
                    Video Alta Calidad
                  </button>
                </a>
              
            </li>
            <li>
              
                <a href={links.video_low} target="_blank" rel="noopener noreferrer">
                <button>
                  Video Baja Calidad
                  </button>
                </a>
              
              </li>
          </ul>
        </div>
      )}
      </div>
      
      <div className='derecha'>
      <div className="recent-results">
        <h2>Buscados Recientemente:</h2>
        {recentResults.map((recent, index) => (
          <div
            key={index}
            className="recent-item"
            onClick={() => handleRecentResultClick(recent)}
          >
            <img src={recent.thumbnail_url} alt="Thumbnail del video" />
            <p>{recent.title}</p>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

export default App
