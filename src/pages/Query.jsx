import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// import "../css/buttons.css";
import config from "../../config";

export default function Query() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState([]);
  const [error, setError] = useState("");

  const sendQuery = async () => {
    try {
      const res = await fetch(`${config.serverUrl}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (res.status !== 200) {
        const resJson = await res.json();
        setError(resJson.sqlMessage);
        return;
      }
      return await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  const showView = (data) => {
    let row = [];
    let head = [];
    for (let key in data[0]) {
      head.push(
        <label
          className="border border-2 d-flex justify-content-center  bg-warning fs-6"
          style={{ width: 230 }}
        >
          {key}
        </label>
      );
    }
    row.push(
      <div className="d-flex justify-content-center flex-row">{head}</div>
    );

    data.map((el, i) => {
      head = [];
      for (let key in data[i]) {
        head.push(
          <textarea
            className="border border-2 d-flex justify-content-center text-center "
            style={{ width: 230 }}
          >
            {data[i][key]}
          </textarea>
        );
      }
      row.push(
        <div className="d-flex justify-content-center flex-row">{head}</div>
      );
    });

    setView(row);
  };

  return (
    <div style={{ margin: 20, padding: 20 }}>
      {error && (
        <div
          class="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
        }}
      >
        <label style={{ fontSize: 28, margin: 3 }}>enter query</label>
        <textarea
          cols={80}
          rows={3}
          style={{ padding: 5, fontSize: 18 }}
          value={query}
          onChange={(e) => {
            setError("");
            setQuery(e.target.value);
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 40,
        }}
      >
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => {
            setView([]);
            sendQuery().then((data) => {
              showView(data);
            });
          }}
        >
          submit
        </button>
      </div>

      <div className="overflow-auto mt-5">
        <div className="d-flex justify-content-center flex-column">{view}</div>
      </div>
    </div>
  );
}
