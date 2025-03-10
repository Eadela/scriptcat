import { init, proxyContext, writables } from "./utils";

describe("proxy context", () => {
  const context: any = {};
  const global: any = {
    gbok: "gbok",
    onload: null,
    eval: () => {
      console.log("eval");
    },
  };
  init.set("onload", true);
  init.set("gbok", true);
  const _this = proxyContext(global, context);

  it("set contenxt", () => {
    _this["md5"] = "ok";
    expect(_this["md5"]).toEqual("ok");
    expect(global["md5"]).toEqual(undefined);
  });

  it("set window null", () => {
    _this["onload"] = "ok";
    expect(_this["onload"]).toEqual("ok");
    expect(context["onload"]).toEqual(undefined);
    expect(global["onload"]).toEqual("ok");
  });

  it("update", () => {
    _this["okk"] = "ok";
    expect(_this["okk"]).toEqual("ok");
    expect(global["okk"]).toEqual(undefined);
    _this["okk"] = "ok2";
    expect(_this["okk"]).toEqual("ok2");
    expect(global["okk"]).toEqual(undefined);
  });

  it("访问global的对象", () => {
    expect(_this["gbok"]).toEqual("gbok");
  });
});

describe("兼容问题", () => {
  console.log("ok");
  const _this = proxyContext({}, {});
  // https://github.com/xcanwin/KeepChatGPT 环境隔离得不够干净导致的
  it("Uncaught TypeError: Illegal invocation #189", () => {
    return new Promise((resolve) => {
      console.log(_this.setTimeout.prototype);
      _this.setTimeout(resolve, 100);
    });
  });
  // AC-baidu-重定向优化百度搜狗谷歌必应搜索_favicon_双列
  it("TypeError: Object.freeze is not a function #116", () => {
    expect(() => _this.Object.freeze({})).not.toThrow();
  });
});
