{
    // initial housecleaning..
    for (const tableDiv of document.querySelectorAll(".nfl-players[data-url")) {
        // var table = document.getElementById("nfl-players-table");
        const table = document.createElement("table");

        table.id = "myTable";
        table.classList.add("nfl-players-table", "sortable");
        // sorttable.makeSortable(table);

        table.innerHTML = `
            <thead>
                <tr>
                <th class="sorttable_nosort">Player Name</th>
                <th class="sorttable_nosort">Team</th>
                <th class="sorttable_nosort" title="Player's Position">Pos</th>
                <th class="sorttable_nosort" title="Rushing Attempts">Att</th>
                <th class="sorttable_nosort" title="Rushing Attempts Per Game Average">Att/G</th>
                <th title="Total Rushing Yards" style="cursor: pointer;">Yds</th>
                <th class="sorttable_nosort" title="Rushing Yards Per Game">Yds/G</th>
                <th class="sorttable_nosort" title="Rushing Average Yards Per Game">Avg</th>
                <th title="Total Rushing Touchdowns" style="cursor: pointer;">TD</th>
                <th title="Longest Rush -- a T represents a touchdown occured" style="cursor: pointer;">Lng</th>
                <th class="sorttable_nosort" title="Rushing First Downs">1st</th>
                <th class="sorttable_nosort" title="Rushing First Down Percentage">1st%</th>
                <th class="sorttable_nosort" title="Rushing 20+ Yards Each">20+</th>
                <th class="sorttable_nosort" title="Rushing 40+ Yards Each">40+</th>
                <th class="sorttable_nosort" title="Rushing Fumbles">FUM</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Loading</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th>Player Name</th>
                    <th>Team</th>
                    <th title="Player's Position">Pos</th>
                    <th title="Rushing Attempts">Att</th>
                    <th title="Rushing Attempts Per Game Average">Att/G</th>
                    <th title="Total Rushing Yards">Yds</th>
                    <th title="Rushing Yards Per Game">Yds/G</th>
                    <th title="Rushing Average Yards Per Game">Avg</th>
                    <th title="Total Rushing Touchdowns">TD</th>
                    <th title="Longest Rush -- a T represents a touchdown occured">Lng</th>
                    <th title="Rushing First Downs">1st</th>
                    <th title="Rushing First Down Percentage">1st%</th>
                    <th title="Rushing 20+ Yards Each">20+</th>
                    <th title="Rushing 40+ Yards Each">40+</th>
                    <th title="Rushing Fumbles">FUM</th>
                </tr>
            </tfoot>
        `;

        // append table to div
        tableDiv.append(table);

        // update table after setting header/footer on load
        updateTable(tableDiv);
    }

    /**
     * Populate the rows of table
     * 
     * @param {HTMLDivElement} tableDiv 
     */
    async function updateTable(tableDiv) {
        // console.log("hi praise");

        const table = tableDiv.querySelector(".nfl-players-table");
        // const response = await fetch("/data");
        const response = await fetch(tableDiv.dataset.url);
        const data = await response.json(); // parse response as json

        // clear table body
        table.querySelector("tbody").innerHTML = "";

        for (var i = 0; i < data.length; i++) { // looping through the data array

            var object = data[i];
            // console.log(object);

            var row = table.querySelector("tbody").insertRow();

            for (var property in object) { // iterating the JSON by key(property)
                // Debug - praise
                // console.log("property: " + property);
                // console.log("value: " + object[property]);

                var cell = row.insertCell();
                cell.innerHTML = object[property];
            }
        }
    }

    /**
     * search table on player name column
     */
    function searchPlayers() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("searchPlayers");
        filter = input.value.toUpperCase();
        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");

        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0]; // gets the player name columns
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else { // row should be filtered out
                    tr[i].style.display = "none";
                }
            }
        }
    }
}