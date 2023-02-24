import img from '../../Assets/sliderImg.webp';

export default function Slides() {
  return (
    <>
      <div className="container-fluid mt-3" style={{ height: '100%' }}>
        <h1 style={{ marginBottom: '70px', marginTop: '250px', color: 'white', textAlign: 'center' }}>Hiring Companies!</h1>
        <div
          id="carouselExampleIndicators"
          className="carousel slide pointer-event col-lg-12 border border-dark"
          data-bs-ride="true"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className=""
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
              className=""
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
              className="active"
              aria-current="true"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active border">
              <img className="img-fluid" src={img} alt="..." />
            </div>
            <div className="carousel-item">
              <img className="img-fluid" src={img} alt="..." />
            </div>
            <div className="carousel-item">
              <img
                className="img-fluid"
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fHdlYnNpdGV8ZW58MHx8MHx8&auto=format&fit=crop&w=1500&q=60&h=400"
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
}
