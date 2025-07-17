export default function Carousel({ isActive, img, text, author, alt }) {
  return (<>
    <div className={`carousel-item ${isActive ? 'active' : ''}`}>
      <div className="row justify-content-center py-5">
        <div className="col-md-8 d-flex flex-column flex-md-row">
          <img
            src={img}
            alt={alt}
            className="rounded-circle me-md-5 mx-auto"
            style={{ width: '160px', height: '160px', objectFit: 'cover', }} />
          <div className="d-flex flex-column mt-3">
            <p className="h5">“{text}”</p>
            <p className="mt-auto text-muted">{author}</p>
          </div>
        </div>
      </div>
    </div>
  </>)
}