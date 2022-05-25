
export default (props) => {
    const date = new Date(props.profile.createdAt)

    return (
        <div className="col">
            <div className="card shadow-sm">
                <img className="bd-placeholder-img card-img-top" 
                     src={props.profile.profile_image}
                     />

                <div className="card-body">
                <p className="card-text h5">{props.profile.headline}</p>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">
                    <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                    <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                    </div>
                    <small className="text-muted">{date.toLocaleDateString('lt-LT')}</small>
                </div>
                </div>
            </div>
        </div>
    )
}