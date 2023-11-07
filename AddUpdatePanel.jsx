export function AddUpdatePanel({ panelItem, inputChangeHandler, doneClickHandler, resetClickHandler, cancelClickHandler, selectedItem }) {
    const { id = '', category = '', description = '', price = '', vegetarian = false } = panelItem || selectedItem || {};
    const isIdFieldDisabled = selectedItem;
  
    return (
      <div id="controlPanel" className="col">
        <div className="row">
          <div className="col-2">
            <p>ID</p>
          </div>
          <div className="col-2">
            <input
              type="number"
              value={id}
              onChange={(e) => inputChangeHandler('id', e.target.value)}
              disabled={isIdFieldDisabled}
            />
          </div>
        </div>
      <div className="row">
        <div className="col-2">
          <p>Category</p>
        </div>
        <div className="col-2">
          <select name="category" id="category" value={category} onChange={(e) => inputChangeHandler('category', e.target.value)}>
            <option value="app">Appetizer</option>
            <option value="ent">Entree</option>
            <option value="des">Dessert</option>
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col-2">
          <p>Description</p>
        </div>
        <div className="col-2">
          <input type="text" value={description} onChange={(e) => inputChangeHandler('description', e.target.value)} />
        </div>
      </div>
      <div className="row">
        <div className="col-2">
          <p>Price</p>
        </div>
        <div className="col-2">
          <input type="number" value={price} onChange={(e) => inputChangeHandler('price', e.target.value)} />
        </div>
      </div>
      <div className="row">
        <div className="col-2">
          <p>Vegetarian</p>
        </div>
        <div className="col-2">
          <input type="checkbox" checked={vegetarian} onChange={(e) => inputChangeHandler('vegetarian', e.target.checked)} />
        </div>
      </div>
      <div className="row">
        <div className="col-9">
          <button id="btnDone" onClick={doneClickHandler} className="btn btn-secondary m-3">Done</button>
          <button id="btnReset" onClick={resetClickHandler} className="btn btn-secondary m-3">Reset</button>
          <button id="btnCancel" onClick={cancelClickHandler} className="btn btn-secondary m-3">Cancel</button>
        </div>
      </div>
    </div>
  );
}
