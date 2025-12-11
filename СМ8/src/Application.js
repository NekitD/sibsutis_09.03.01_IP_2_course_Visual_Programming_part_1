import React from 'react';
import DataGrid from "./DataGrid.jsx";

export default function Application() {
    const head = "DataGrid";
    const content1 = [{ header: "data-grid.exe", body: null }];
    const content2 = [{ header: "data-grid-pro.exe", body: null }];
    const content3 = [{ header: "data-grid-pro-max.exe", body: null }];

    const content4 = [{ header: "data-grid-bin", body: content1 }];
    const content5 = [{ header: "data-grid-pro-bin", body: content2 }];
    const content6 = [{ header: "data-grid-pro-bin", body: content3 }];


    const content = [{ header: "data-grid", body: content4 }, { header: "data-grid-pro", body: content5 }, { header: "data-grid-pro-max", body: content6 }];
    return (
        <DataGrid header={head} body={content} />
    );
}