export function ButtonPanel({ addClickHandler, updateClickHandler, deleteClickHandler, selectedItem }) {
    return (
      <div id="buttonPanel" className="col">
        <div className="row">
          <button id="btnAdd" className="col-3 btn btn-primary m-3" onClick={addClickHandler}>
            Add
          </button>
          <button
            id="btnUpdate"
            className={`col-3 btn btn-primary m-3 ${selectedItem ? '' : 'disabled'}`}
            onClick={updateClickHandler}
          >
            Update
          </button>
          <button
            id="btnDelete"
            className={`col-3 btn btn-primary m-3 ${selectedItem ? '' : 'disabled'}`}
            onClick={deleteClickHandler}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
  