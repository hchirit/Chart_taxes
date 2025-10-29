function ExecuteClarityQuery(QueryCode,serverName, filters) {
    let xogServer = serverName + '/niku/xog';
    let data;
    let xmlFilters = '';
    // build soap request
    if(filters) {
        Object.keys(filters).forEach(key => xmlFilters = xmlFilters + '<param_'+key.toLowerCase()+'>'+filters[key]+'</param_'+key.toLowerCase()+'>')
        xmlFilters = '<Filter>' + xmlFilters + '</Filter>';
    }
    data =
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
    'xmlns:xsd="http://www.w3.org/2001/XMLSchema"> ' +
    '<soapenv:Header>' +
     '<xog:Auth xmlns:xog="http://www.niku.com/xog/Object"> ' +
      '<xog:SessionID>' + document.cookie.split('=')[1] + '</xog:SessionID>' +
       '</xog:Auth>' +
        '</soapenv:Header>'+
        '<soapenv:Body>'+
         '   <Query xmlns="http://www.niku.com/xog/Query"><Code>' + QueryCode + '</Code>' + xmlFilters + ' </Query>' +
        '</soapenv:Body>' +
    '</soapenv:Envelope>';

    // send synchronous request
    const request = new XMLHttpRequest();
    request.open("POST", xogServer, false); // 'false' makes the request synchronous
    request.setRequestHeader('Content-Type', 'text/xml');
    request.send(data);

    if (request.status === 200) {
        let items = xmlTextToJSON(request.responseText);
        return items;
    }
}

// xml response to json elements
function xmlTextToJSON(text){
    parser=new DOMParser();
    xmlDoc=parser.parseFromString(text,'text/xml');
    //console.log(text);
    let items = xmlDoc.getElementsByTagName('Record');
    items = [...items].map((el) => {
        let childs = [...el.children];
        let element = {};
        childs.forEach(child => {element[child.localName] = child.textContent;});
        return element;
    });
    return items;
}

// How to use getDataFromQuery:
//let url = window.document.URL;
//let ServerName = url.substring(0,url.indexOf("niku/")-1);
//let items = ExecuteClarityQuery("DorCustomers",ServerName,{paramNAME1: 0.1, paramNAME2: 0.2});

