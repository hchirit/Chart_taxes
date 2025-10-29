// Function to generate filter HTML dynamically, now with page identifier
function createFilterSquare(filterData, pageId) {
    const filterContainer = document.getElementById('filter-container');

    filterData.forEach((filter, index) => {
        const filterDiv = document.createElement('div');
        filterDiv.classList.add('filter-square');
        // filterDiv.setAttribute('onclick', `toggleDropdown(${index}, '${pageId}')`);

        const squareContent = `
            <div class="square-content">
                <select id="search-${pageId}-${index}" class="select-filter" onchange="handleOptionChange(${index}, '${pageId}')">
                    ${filter.options.map(option => `<option id="${option.id}" value="${option.value}">${option.value}</option>`).join('')}
                </select>
            </div>
        `;

        console.log(document.getElementById("2025"));
        // document.getElementById("2025").selected = true;
        filterDiv.innerHTML = squareContent;
        filterContainer.appendChild(filterDiv);
        // document.getElementById("2025").selected = true;
    });
}

// Function to toggle dropdown visibility
function toggleDropdown(index, pageId) {
    // const dropdown = document.getElementById(`dropdown-${pageId}-${index}`);
    // dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Function to handle option change event
function handleOptionChange(index, pageId) {
    const selectElement = document.getElementById(`search-${pageId}-${index}`);
    const selectedValue = selectElement.value;
    const selectedIndex = selectElement.selectedIndex;
    const selectedOption = selectElement.options[selectedIndex];
    console.log(selectedOption.id);

    // Log the selected value along with the page it came from
    console.log(`Page: ${pageId}, Selected option for filter ${index}: ${selectedValue}`);
    const event = new CustomEvent('filterSelected', {
        detail: { page: selectedOption.id }
    });
    document.dispatchEvent(event);
}
