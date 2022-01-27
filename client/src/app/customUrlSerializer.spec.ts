import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CustomUrlSerializer } from "./customUrlSerializer";

describe("pieceService", () => {
  let provider: CustomUrlSerializer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomUrlSerializer],
    });
    provider = TestBed.inject(CustomUrlSerializer);
  });

  it("should be created", () => {
    expect(provider).toBeTruthy();
  });

  it("test parse", () => {
    const parse = provider.parse("#room[test]");
    expect(parse).not.toEqual(null);
  });

  it("test false parse", () => {
    const parse = provider.parse("room[test]");
    expect(parse).not.toEqual(null);
  });

  it("test serialize", () => {
    const parse = provider.parse("#room[test]");
    const serialize = provider.serialize(parse);
    expect(serialize).not.toEqual(null);
  });
});
