{
    /**
     * 
     * @param {*} tableID id of table to download
     */
    function exportToCsv(tableID) {
        // get table element and array of rows
        const table = document.getElementById(tableID);
        var rows = Array.from(table.querySelectorAll("tr"));

        // remove footer row
        rows.pop();
        // console.log(rows);

        // convert to CSV
        const csvOutput = convertToCSV(rows);
        const blob = new Blob([csvOutput], { type: "text/csv" });
        const blobURL = URL.createObjectURL(blob);

        const anchorElement = document.createElement("a");
        anchorElement.href = blobURL;
        anchorElement.download = "nfl-players.csv";
        anchorElement.click();

        setTimeout(() => {
            URL.revokeObjectURL(blobURL);
        }, 500);

    }

    /**
     * Loop through array of table rows and extract cell content
     * 
     * @param {Array of table rows} rows 
     */
    function convertToCSV(rows) {
        var lines = [];
        const numOfColumns = 15;

        for (const row of rows) {
            let line = "";
            // console.log(row.children);

            for (let i = 0; i < numOfColumns; i++) {
                if (row.children[i] !== undefined) {
                    line += parseCell(row.children[i]);
                }
                line += (i !== (numOfColumns -1)) ? "," : "";
            }

            lines.push(line);
        }

        // console.log(lines.join("\n"));
        return lines.join("\n");
    }

    /**
     * Parse the contents of table cell element and modify it to follow the rules of excel sheets
     * 
     * @param {html td element} rowCell 
     */
    function parseCell(rowCell) {

        let parsedValue = rowCell.textContent;

        // replace double quotes with two double quotes
        parsedValue = parsedValue.replace(/"/g, `""`);

        // if value contains comma, new-line or double-quote, enclose in double quotes
        parsedValue = /[",\n]/.test(parsedValue) ? `"${parsedValue}"` : parsedValue;

        return parsedValue;
        // console.log(parsedValue);
    }
}