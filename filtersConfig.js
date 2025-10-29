let url = window.document.URL;
let ServerName = url.substring(0, url.indexOf("niku/") -1);

console.log(ExecuteClarityQuery("obs_gitty",ServerName));

const obsFilters = 
{
    attribute: "OBS",
    options: ExecuteClarityQuery("obs_gitty",ServerName),
}

const yearsFilters =
{
    attribute: "year",
    options: [
        {id:2019, value:2019 ,selected: false},
        {id:2020, value:2020 ,selected: false},
        {id:2021, value:2021 ,selected: false},
        {id:2022, value:2022 ,selected: false},
        {id:2023, value:2023 ,selected: false},
        {id:2024, value:2024 ,selected: false},
        {id:2025, value:2025 ,selected: true},
        {id:2026, value:2026 ,selected: false},
        {id:2027, value:2027 ,selected: false},
        {id:2028, value:2028 ,selected: false}
    ],
}
