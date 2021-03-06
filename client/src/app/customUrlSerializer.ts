import { DefaultUrlSerializer, UrlSerializer, UrlTree } from "@angular/router";
export const hashKey = "7d7a76a09d002f7ed5fa47e7f126f1bf432c557b";

export class CustomUrlSerializer implements UrlSerializer {
  parse(url: any): UrlTree {
    const dus = new DefaultUrlSerializer();
    let urlString: string = url;
    if (urlString.startsWith("#")) {
      urlString = urlString.replace("#", hashKey);
    }
    return dus.parse(urlString);
  }

  serialize(tree: UrlTree): any {
    const dus = new DefaultUrlSerializer();
    let path = dus.serialize(tree);
    path = path.replace(/%5B/g, "[");
    path = path.replace(/%5D/g, "]");
    path = path.replace(hashKey, "#");
    return path;
  }
}
