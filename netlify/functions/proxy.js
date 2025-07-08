exports.handler = async (event, context) => {
  const url = "https://script.google.com/macros/s/AKfycbwyzVKK3YTD3e-rnwosmuI3JWRJxc3iKo4FWIsoGIvd-l71sAMufr75ddrI5HC-dkDw/exec";
  const response = await fetch(url);
  const data = await response.json();
  
  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
}