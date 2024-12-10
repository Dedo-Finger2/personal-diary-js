export class Request {
  static queryParams() {
    const urlParams = new URLSearchParams(window.location.search);

    const queryParamsObj = {};

    for (const paramsArray of urlParams.entries()) {
      for (let index = 0; index <= paramsArray.length - 1; index += 2) {
        const key = paramsArray[index];
        const value = paramsArray[index + 1];

        queryParamsObj[key] = value;
      }
    }

    return queryParamsObj;
  }
}
