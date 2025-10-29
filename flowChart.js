/* Configuration générale (années / sélection) */
let selectedYear = 2025;

/* Données du flowchart (nodes / edges / styles) */
const flowchartData = {
   nodes: [
    { id: "A", label: "מ1,344"},
    { id: "B", label: "572"  },
    { id: "C", label: "משימות ראשוניות<br>741" },
    { id: "D", label: "חדשות<br>393"  },
    { id: "E", label: "ממושכות<br>76"  },
    { id: "F", label: "ממושכות<br>182"},
    { id: "G", label: "חומר<br>285" },
    { id: "H", label: "מאושר<br>לביצוע<br>83"  },
    { id: "I", label: "ממושכות<br>מבטולות<br>25"},
    { id: "J", label: "חומר<br>87"},
    { id: "K", label: "מאושר<br>לביצוע<br>16"},
    { id: "L", label: "מבטלות<br>26"  },
    { id: "M", label: "אמצע שנה<br>103"  },
	{ id: "N", label: "מבטלות<br>26"  },
    { id: "O", label: "אמצע שנה<br>103"  }
  ],
  edges: [
    { from: "A", to: "B" , id:'ea', caption: "משימות בשיתוף שעם"},
    { from: "A", to: "C" , id:'eb',caption: "משימות רשות המיסים"},
    { from: "B", to: "D" , id:'ec',caption: "חדשות"},
    { from: "B", to: "E" , id:'ed',caption: "ממשיכות"},
    { from: "B", to: "F" , id:'ee',caption: "מאמצע השנה"},
    { from: "C", to: "G" , id:'ef',caption: "חדשות"},
    { from: "C", to: "H" , id:'eg',caption: "ממשיכות"},
    { from: "D", to: "I" , id:'eh',caption: "הומר"},
    { from: "D", to: "J" , id:'ei',caption: "מאושר לביצוע"},
    { from: "D", to: "K" , id:'ej',caption: "מבוטלות"},
    { from: "F", to: "L" , id:'ek',caption: "הומר"},
    { from: "F", to: "M" , id:'el',caption: "מאושר לביצוע"},
	{ from: "G", to: "N" , id:'em',caption: "מבוטלות"},
	{ from: "H", to: "O" , id:'en',caption: "מבוטלות"},
	{ from: "F", to: "P" , id:'eo',caption: "מבוטלות"}
  ],

  styles: [
    { id: "A", background: "#d2e9ab", border: "#4479ba", textColor: "#000550" },
    { id: "B", background: "#d2e9ab", border: "#4479ba" },
    { id: "C", background: "#d2e9ab", border: "#4479ba" },
    { id: "D", background: "#d2e9ab", border: "#4479ba" },
    { id: "E", background: "#d2e9ab", border: "#4479ba" },
    { id: "F", background: "#b5af8c", border: "#e6a15d" },
    { id: "G", background: "#d2e9ab", border: "#4479ba" },
    { id: "H", background: "#d2e9ab", border: "#4479ba" },
    { id: "I", background: "#d2e9ab", border: "#4479ba" },
    { id: "J", background: "#b5af8c", border: "#4479ba" },
    { id: "K", background: "#d2e9ab", border: "#cc7d75" },
    { id: "L", background: "#b5af8c", border: "#4479ba" },  
    { id: "M", background: "#d2e9ab", border: "#4479ba" },
	{ id: "N", background: "#d2e9ab", border: "#cc7d75" },  
    { id: "O", background: "#d2e9ab", border: "#cc7d75" },
	{ id: "P", background: "#d2e9ab", border: "#cc7d75" }
 
  ]
};

// Calcule un pourcentage moyen et renvoie une chaîne formatée ex: "23.45%"
const average = arr => arr.length ? String(((arr.reduce((sum, val) => sum + val, 0) / arr.length) * 100).toFixed(2)) + '%' : 0;


function getData() {
  if (selectedYear !== undefined) {
    // ATTENTION: 'url' n'est pas défini dans les photos capturées.
    // Je garde ici la logique telle que l'on voit: extraction du ServerName depuis 'url'
    let ServerName = url.substring(0, url.indexOf("nixa/") - 1);
    let items;
    let filters = {
      year: selectedYear
    };
    items = ExecuteClarityQuery("dash_rashut_pm", ServerName, filters);
    console.log(items);
    return items;
  }
  return null;
}

mermaid.initialize({
  startOnLoad: false,
  //theme: 'base',
  themeVariables: { fontSize: '25px' },
  //theme: 'default',
  padding: 15,
  flowchart: {
    curve: "linear" // Use straight lines instead of rounded arrows
    //spacing: 500
  }
});

// const generateFlowChart = (async (data) => {
//     await
function generateFlowChart(data, selectedYear) {
    // Construct the Mermaid syntax
    let flowSyntax = "graph TB\n"
flowSyntax += `subgraph Gr GR[משימות בשיתוף שעם ${selectedYear}]\n`
    flowSyntax += `direction TB\n`
    const dataNode = getData();

    const nodeCounts = [
       { id: "A", label: dataNode.length},
			{ id: "B", label: dataNode.filter(obj => obj.common_shaam == 'true').length  },
			{ id: "C", label: dataNode.filter(obj => obj.common_shaam == 'false').length  },
			{ id: "D", label: dataNode.filter(obj => obj.common_shaam == 'true' && obj.apro_start_year == selecetdYear).length  },
			{ id: "E", label: dataNode.filter(obj => obj.common_shaam == 'true' && obj.apro_start_year != selecetdYear  &&  obj.statut_idea_changeme == "4" && obj.status == "8" && new Date(obj.start).getFullYear()<selecetdYear).length  },
			{ id: "F", label: dataNode.filter(obj => obj.common_shaam == 'true' && obj.apro_start_year != selecetdYear &&  obj.statut_idea_changeme != "1" &&(obj.status != "8" || (obj.status == "8" && new Date(obj.start).getFullYear()>=selecetdYear))).length  },
			{ id: "G", label: dataNode.filter(obj => obj.common_shaam == 'false' &&  obj.statut_idea_changeme == "3" && obj.apro_start_year == selecetdYear).length  },
			{ id: "H", label: dataNode.filter(obj => obj.common_shaam == 'false' &&  obj.statut_idea_changeme == "4" && obj.apro_start_year == selecetdYear).length  },
			{ id: "I", label: dataNode.filter(obj => obj.common_shaam == 'true' && obj.apro_start_year == selecetdYear &&  obj.statut_idea_changeme != "1" && obj.status == "8").length  },
			{ id: "J", label: dataNode.filter(obj => obj.common_shaam == 'true' && obj.apro_start_year == selecetdYear &&  obj.statut_idea_changeme != "1" && obj.status == "1").length  },
			{ id: "K", label: dataNode.filter(obj => obj.common_shaam == 'true' && obj.apro_start_year == selecetdYear &&  obj.canceled_year	== selecetdYear).length  },
			{ id: "L", label: dataNode.filter(obj => obj.common_shaam == 'true' && obj.apro_start_year != selecetdYear && obj.status == "8" &&  obj.statut_idea_changeme != "1" && new Date(obj.start).getFullYear()>=selecetdYear).length  },
			{ id: "M", label: dataNode.filter(obj => obj.common_shaam == 'true' && obj.apro_start_year != selecetdYear && obj.status == "1" &&  obj.statut_idea_changeme != "1" ).length  },
			{ id: "N", label: "מבטלות<br>26"  },
			{ id: "O", label: "אמצע שנה<br>103"  },
			{ id: "P", label: dataNode.filter(obj => obj.common_shaam == 'true' && obj.apro_start_year != selecetdYear && obj.canceled_year	== selecetdYear &&(obj.status != "8" || (obj.status == "8" && new Date(obj.start).getFullYear()>=selecetdYear))).length  }
		  
    ];

    const subgraphs = [
        {
		  title: "% ביצוע שלישוני",
		  id: "SA",
		  idNode:"SAA",
		  node: average(dataNode.filter(obj => obj.common_shaam == 'false' &&  obj.statut_idea_changeme != "1" && (obj.status == "8" || obj.status == "1" ) && ["1","3","7"].includes(obj.verification_statut) ).map(item => Number(item["note_tri_general"])))  
		},
		{
		  title: "% ביצוע שנתי",
		  id: "SB",
		  idNode:"SBA",
		  node: average(dataNode.filter(obj => obj.common_shaam == 'false' &&  obj.statut_idea_changeme != "1" && (obj.status == "8" || obj.status == "1" )  ).map(item => Number(item["cal_sp_idea"])))
		},
		{
		  title: "% ביצוע כללי",
		  id: "SC",
		  idNode:"SCA",
		  node: average(dataNode.filter(obj => obj.common_shaam == 'true' &&  obj.statut_idea_changeme != "1" && (obj.status == "8" || obj.status == "1" ) ).map(item => Number(item["percent_complete"])))
		},
		{
		  title: "% ביצוע פרויקטים שהומרו",
		  id: "SD",
		  idNode:"SDA",
		  node: average(dataNode.filter(obj => obj.common_shaam == 'true' &&  obj.statut_idea_changeme != "1" && obj.status == "8"   ).map(item => Number(item["percent_complete"])))
		}
    ];

    nodeCounts.forEach((node) => {
        flowSyntax += `${node.id}[${node.label}]\n`;
    });
    // data.edges.forEach((edge) => {
    //     flowSyntax += `${edge.id}[${edge.caption}]\n`;
    // });
    // //

    data.edges.forEach((edge) => {
        flowSyntax += `${edge.from}  -- ${edge.caption}--> ${edge.to} \n`;
    });

    flowSyntax += "end\n";
    flowSyntax += `graph RL\n`
    flowSyntaxSubgraph += `class DefSmallSubgraph padding: 5px, margin: 5px\n`
    flowSyntaxSubgraph += `direction RL\n`
    subgraphs.forEach((subgraph) => {
        flowSyntaxSubgraph += `subgraph ${subgraph.id} [${subgraph.title}]\n`

        flowSyntaxSubgraph += `  ${subgraph.idNode}(${subgraph.node})\n`
        flowSyntaxSubgraph += `end\n`;
        flowSyntaxSubgraph += `style ${subgraph.idNode} stroke-width: 2px, rx:15, ry:15, fill: #FFFFFF, stroke:#001B5B, color: #001B5B;\n`
        flowSyntaxSubgraph += `style ${subgraph.id} stroke-width:0px, fill: transparent, stroke:transparent, color: #001B5B\n;`
        flowSyntaxSubgraph += `class ${subgraph.id} SmallSubgraph\n;`
    });
    //flowSyntaxSubgraph += `end\n`;
    flowSyntax += `style GR stroke:transparent, stroke-width:0px, fill: transparent, padding: 50px\n;`
    //flowSyntaxSubgraph += `style V stroke:transparent, stroke-width:0px, fill: transparent, padding: 0px\n;`
    //flowSyntaxSubgraph += `class Def bigSubraph padding: 5px, margin: 5px, left: 20%\n;`
    //flowSyntaxSubgraph += `class V bigSubraph\n;`

    // Add styles
    data.styles.forEach((style) => {
        flowSyntax += `style ${style.id} fill: ${style.background}, stroke: ${style.border}, font-size: 30px, rx:6, ry:6, stroke-width:2px, color: #001B5B\n;`
    });
    //data.edges.forEach((edge) => {
        //flowSyntax += `style ${edge.id} stroke-width:0px, fill: transparent, stroke:transparent\n;`
    //});
    //
    flowSyntax += `linkStyle default stroke: #001B5B, color: #001B5B, labelBackgroundColor:red\n`;
    // Render the chart
    const flowchartContainer = document.getElementById("flowchart");
    const flowchartContainer2 = document.getElementById("flowchartSub");
	
    try {
        const {svg} = await mermaid.render("theGraph", flowSyntax);
		const {svg: svg2} = await mermaid.render("theGraph2", flowSyntaxSubgraph);
        console.log("hihihi"+ flowSyntax);
        flowchartContainer.innerHTML = svg;
        flowchartContainer2.innerHTML = svg2;
        //const svgElement = document.getElementById('flowchart').querySelector('svg');
        //svgElement.querySelectorAll('text').forEach(text => { text.setAttribute('style','font-size: 24px;');
        //});
        setTimeout(() => {
            const svgElem = flowchartContainer.querySelector("svg");

            const labels = svgElem.querySelectorAll(".edgeLabel"));

            labels.forEach(label => {
                const text = label.querySelector("span");
                console.log(text);
                if (!text) return;

               // const bbox = text.getBBox();

                // Create rect behind text
                //const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                //rect.setAttribute("x", bbox.x - 4);
                //rect.setAttribute("y", bbox.y - 2);
                //rect.setAttribute("width", bbox.width + 8);
                //rect.setAttribute("height", bbox.height + 4);
                // rect.style.backgroundColor = "red !important";
                //text.style.backgroundColor = "red !important";
                //rect.setAttribute("rx", "4");
                //rect.setAttribute("ry", "4");
				
                // Insert rect behind text
                //label.insertBefore(rect, text);
            });
        }, 100);
        //
    } catch (error) {
        flowchartContainer.innerHTML = "Invalid syntax";
        setTimeout(() => {
            addClickEvents();
        }, 100);
    };
	
	document.addEventListener("DOMContentLoaded", () => {
    // Generate the chart using data from data.js
    generateFlowChart(flowchartData);
});

document.addEventListener("filterSelected",function(event){
	selecetdYear = parseInt(event.detail.year, 10);
	console.log("the year that chosen:" , selecetdYear);
	 generateFlowChart(flowchartData);
	
	
});
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', closeModal);

function addClickEvents() {                                                        
	document.querySelectorAll('g[class^="node default"]').forEach(node => {
		
		node.addEventListener('click', () => {
			const nodeId = node.dataset.id;
			showModal(nodeId);
		});
	});
}
function closeModal() {
    const modal = document.getElementById("modal");
    const overlay = document.getElementById("modal-overlay");
    modal.style.display = "none";
    overlay.style.display = "none";
}

function showModal(nodeId) {
    const modal = document.getElementById("modal");
    const overlay = document.getElementById("modal-overlay");

    // Define URLs for each node
    let ServerName = url.substring(0, url.indexOf("niku/") - 1);
	const urls = {
		"A2024": ServerName+"",
		"A2025": ServerName+"",
		"B2024": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MDgzLCJuYW1lIjoi157XqdeZ157XldeqINeR16nXmdeq15XXoyDXqdei150gLSAyMDI0ICjXk9ep15HXldeo15MpIiwibGF5b3V0IjoiZ3JpZCIsInR5cGUiOiJpZGVhcyJ9fQ==",
		"B2025": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTQ0LCJuYW1lIjoi157XqdeZ157XldeqINeR16nXmdeq15XXoyDXqdei150gLSAyMDI1ICjXk9ep15HXldeo15MpIiwibGF5b3V0IjoiZ3JpZCIsInR5cGUiOiJpZGVhcyJ9fQ==",
		"C2024": ServerName+"",
		"C2025": ServerName+"",
		"D2024": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTI1LCJuYW1lIjoi15fXk9ep15XXqiAyNCAo15PXqdeR15XXqNeTKSIsImxheW91dCI6ImdyaWQiLCJ0eXBlIjoiaWRlYXMifX0=",
		"D2025": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTU1LCJuYW1lIjoi15fXk9ep15XXqiAyNSAo15PXqdeR15XXqNeTKSIsImxheW91dCI6ImdyaWQiLCJ0eXBlIjoiaWRlYXMifX0=",
		"E2024": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTIzLCJuYW1lIjoi157Xntep15nXm9eV16ogMjQgKNeT16nXkdeV16jXkykiLCJsYXlvdXQiOiJncmlkIiwidHlwZSI6ImlkZWFzIn19",
		"E2025": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTUzLCJuYW1lIjoi157Xntep15nXm9eV16ogMjUgKNeT16nXkdeV16jXkykiLCJsYXlvdXQiOiJncmlkIiwidHlwZSI6ImlkZWFzIn19",
		"F2024": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MDkxLCJuYW1lIjoi15DXntem16Ig16nXoNeUIDI0LSjXk9ep15HXldeo15MpIiwibGF5b3V0IjoiZ3JpZCIsInR5cGUiOiJpZGVhcyJ9fQ==",
		"F2025": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTQ1LCJuYW1lIjoi15DXntem16Ig16nXoNeUIDI1LSjXk9ep15HXldeo15MpIiwibGF5b3V0IjoiZ3JpZCIsInR5cGUiOiJpZGVhcyJ9fQ==",
		"G2024": ServerName+"",
		"G2025": ServerName+"",
		"H2024": ServerName+"",
		"H2025": ServerName+"",
		"I2024": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTM1LCJuYW1lIjoi15fXk9ep15XXqiAtINeU15XXnteo15UgMjQgKNeT16nXkdeV16jXkykiLCJsYXlvdXQiOiJncmlkIiwidHlwZSI6ImlkZWFzIn19",
		"I2025": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTU4LCJuYW1lIjoi15fXk9ep15XXqiAtINeU15XXnteo15UgMjUgKNeT16nXkdeV16jXkykiLCJsYXlvdXQiOiJncmlkIiwidHlwZSI6ImlkZWFzIn19",
		"J2024": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTU4LCJuYW1lIjoi15fXk9ep15XXqiAtINeU15XXnteo15UgMjUgKNeT16nXkdeV16jXkykiLCJsYXlvdXQiOiJncmlkIiwidHlwZSI6ImlkZWFzIn19",
		"J2025": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTU2LCJuYW1lIjoi15fXk9ep15XXqiDXnteQ15XXqdeo15XXqiDXnNeR15nXpteV16IgMjUgKNeT16nXkdeV16jXkykiLCJsYXlvdXQiOiJncmlkIiwidHlwZSI6ImlkZWFzIn19",
		"K2024": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MzY0LCJuYW1lIjoi15fXk9ep15XXqiDXnteR15XXmNec15XXqiAyNCAo15PXqdeR15XXqNeTKSIsImxheW91dCI6ImdyaWQiLCJ0eXBlIjoiaWRlYXMifX0=",
		"K2025": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MzUzLCJuYW1lIjoi15fXk9ep15XXqiDXnteR15XXmNec15XXqiAyNSAo15PXqdeR15XXqNeTKSIsImxheW91dCI6ImdyaWQiLCJ0eXBlIjoiaWRlYXMifX0=",
		"L2024": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MDkzLCJuYW1lIjoi15DXntem16Ig16nXoNeUICAyNCDXlNeV157XqC0o15PXqdeR15XXqNeTKSIsImxheW91dCI6ImdyaWQiLCJ0eXBlIjoiaWRlYXMifX0=",
		"L2025": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTUxLCJuYW1lIjoi15DXntem16Ig16nXoNeUICAyNSDXlNeV157XqC0o15PXqdeR15XXqNeTKSIsImxheW91dCI6ImdyaWQiLCJ0eXBlIjoiaWRlYXMifX0=",
		"M2024": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MDkyLCJuYW1lIjoi15DXntem16Ig16nXoNeUICAyNCDXnteQ15XXqdeoINec15HXmdem15XXoi0o15PXqdeR15XXqNeTKSIsImxheW91dCI6ImdyaWQiLCJ0eXBlIjoiaWRlYXMifX0=",
		"M2025": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTQ5LCJuYW1lIjoi15DXntem16Ig16nXoNeUICAyNSDXnteQ15XXqdeoINec15HXmdem15XXoi0o15PXqdeR15XXqNeTKSIsImxheW91dCI6ImdyaWQiLCJ0eXBlIjoiaWRlYXMifX0=",
		"N2024": ServerName+"",
		"N2025": ServerName+"",
		"O2024": ServerName+"",
		"O2025": ServerName+"",
		"P2024": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQxMjAwLCJuYW1lIjoi16jXqdeV16ogLSDXkNee16bXoiDXqdeg15QiLCJsYXlvdXQiOiJncmlkIiwidHlwZSI6ImlkZWFzIn19",
		"P2025": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MzQ5LCJuYW1lIjoi15DXntem16Ig16nXoNeUINee15HXldeY15zXldeqIDI0ICjXk9ep15HXldeo15MpIiwibGF5b3V0IjoiZ3JpZCIsInR5cGUiOiJpZGVhcyJ9fQ==",
		"SCA2024": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTM3LCJuYW1lIjoi15DXl9eV15Yg15HXmdem15XXoiDXm9ec15zXmSAyNCAo15PXqdeR15XXqNeTKSIsImxheW91dCI6ImdyaWQiLCJ0eXBlIjoiaWRlYXMifX0=",
		"SCA2025": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTYwLCJuYW1lIjoi15DXl9eV15Yg15HXmdem15XXoiDXm9ec15zXmSAyNSAo15PXqdeR15XXqNeTKSIsImxheW91dCI6ImdyaWQiLCJ0eXBlIjoiaWRlYXMifX0=",
		"SDA2024": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTQyLCJuYW1lIjoi15DXl9eV15Yg15HXmdem15XXoiDXpNeo15XXmden15jXmdedINep15TXldee16jXlSAyNCAo15PXqdeR15XXqNeTKSIsImxheW91dCI6ImdyaWQiLCJ0eXBlIjoiaWRlYXMifX0=",
		"SDA2025": ServerName+"/pm/#/ideas/common?_meta=eyJ2aWV3Ijp7ImlkIjo1MjQ0MTYyLCJuYW1lIjoi15DXl9eV15Yg15HXmdem15XXoiDXpNeo15XXmden15jXmdedINep15TXldee16jXlSAyNSAo15PXqdeR15XXqNeTKSIsImxheW91dCI6ImdyaWQiLCJ0eXBlIjoiaWRlYXMifX0="
	};
	
	
	// Set modal content with iframe
	const urlView = urls[nodeId+selectedYear] || "about:blank";
	console.log(urlView, nodeId);
	modal.querySelector("#modal-content").innerHTML = `
		<iframe id="iframe" src="${urlView}" width="100%" height="600" style="border: none;">
		<link type="text/css" rel="Stylesheet" href="iframe.css" />
		</iframe>
	`;

	const iframe = document.getElementById('iframe');
	iframe.onload = () => {
		const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

		if (iframeDoc) {
			var cssLink = document.createElement("link");
			cssLink.href = "../niku/ui/custom/dashboard-rashut/iframe.css";
			cssLink.rel = "stylesheet";
			iframeDoc.head.appendChild(cssLink);
		} else {
			console.error('Unable to access iframe content.');
		}
	};

	modal.style.display = "block";
	overlay.style.display = "block";
}
	createFilterSquare([yearsFilters], 'flowChart');

	
	


