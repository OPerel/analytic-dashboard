import Auth from './oktaAuth';

const fetchDecorator = async (req: Request) => {
  const accessToken = await Auth.getAccessToken();

  const headersWithAuth = new Headers(req.headers);
  if (accessToken) {
    headersWithAuth.set('Authorization', `Bearer ${accessToken.value}`);
  }
  
  const authenticatedReq = new Request(req, {
    headers: headersWithAuth,
  });

  try {
    const json = await fetch(authenticatedReq);

    const { status } = json;
    if (status < 200 || status > 399) {
      const err = await json.json();
      throw err;
    }
    const data = await json.json();
    return data;
  } catch (err) {
    // console.log('Error fetching: ', err)
    throw Error(err.message);
  }
};

export default fetchDecorator;