export default function Carousel({ isActive, img, text, author, alt }) {
  return (<>
    <div className={`carousel-item ${isActive ? 'active' : ''}`}>
      <div className="row justify-content-center py-7">
        <div className="col-md-8 d-flex">
          <img
            src={img}
            alt={alt}
            className="rounded-circle me-5"
            style={{ width: '160px', height: '160px', objectFit: 'cover', }} />
          <div className="d-flex flex-column">
            <p className="h5">“{text}”</p>
            <p className="mt-auto text-muted">{author}</p>
          </div>
        </div>
      </div>
    </div>
  </>)
}