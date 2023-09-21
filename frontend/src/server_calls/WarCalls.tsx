const backendURL = "http://localhost:3001"; 


export async function newGame(): Promise<string> {
  try {
    const response = await fetch(`${backendURL}/newGame` );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    return String(error);
  }
}

export async function nextRound(): Promise<string> {
    try {
      const response = await fetch(`${backendURL}/nextRound` );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.text();
      return data;
    } catch (error) {
      return String(error);
    }
  }


