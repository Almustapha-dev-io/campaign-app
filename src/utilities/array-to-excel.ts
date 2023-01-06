const createXMLTable = (table: any, fileName: any) => {
  const xmlTable = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40"
  >
     <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"/>
     <head>
        <xml>
          <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                  <x:ExcelWorksheet>
                      <x:Name>${fileName}</x:Name>
                      <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                  </x:ExcelWorksheet>
              </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
     </head>
     <body>
       ${table}
     </body>
  </html> `;
  return xmlTable;
};

const createFileUrl = (xmlTable: any) => {
  const tableBlob = new Blob([xmlTable], {
    type: 'application/vnd.ms-excel;base64,',
  });
  const downloadURL = URL.createObjectURL(tableBlob);
  return downloadURL;
};

const downloadFile = (downloadURL: any, fileName: any) => {
  const downloadLink = document.createElement('a');
  document.body.appendChild(downloadLink);
  downloadLink.download = fileName;
  downloadLink.href = downloadURL;
  downloadLink.click();
};

const arrayToExcel = (() => ({
  convertArrayToTable: async (apiArray: any, fileName: any) => {
    const tableHeaders = `<tr>${Object.keys(apiArray[0])
      .map((key) => `<td>${key}</td>`)
      .join('')}</tr>`;

    const tableRows = apiArray
      .map((obj: any) => [
        `<tr>
      ${Object.keys(obj)
        .map(
          (key) =>
            `<td>${obj[key] === null || obj[key] === '' ? '' : obj[key]}</td>`
        )
        .join('')}
    <tr/>`,
      ])
      .join('');

    const table = `<table>${tableHeaders}${tableRows}</table>`.trim();
    const xmlTable = createXMLTable(table, fileName);
    const downloadURL = createFileUrl(xmlTable);
    downloadFile(downloadURL, fileName);
  },
}))();

export default arrayToExcel;
