const { expect } = require("chai");
const start = require("../../app");
const expectError = require("../drivers/expectError");

const {
  videoPayload,
  createVideo,
} = require("../drivers/video")();

describe("/video", function () {
  let server;

  before(async () => {
    server = await start();
  });

  after(() => {
    server.close();
  });

  describe("POST", () => {
    it("should create and return video", async () => {
      const video = videoPayload();
      const response = await createVideo();
      expect(response.status).to.equal(201);

      const {
        id,
        name,
        url,
        thumbnailUrl,
        isPrivate,
        timesViewed,
        createdAt,
        updatedAt,
      } = await response.json();

      expect(id).to.not.be.undefined;
      expect(id).to.be.a("number");

      expect(name).to.equal(video.name);
      expect(name).to.be.a("string");

      expect(url).to.be.a("string");
      expect(url).to.equal(video.url);

      expect(thumbnailUrl).to.be.a("string");
      expect(thumbnailUrl).to.equal(video.thumbnailUrl);

      expect(isPrivate).to.be.a("boolean");
      expect(isPrivate).to.equal(video.isPrivate);

      expect(timesViewed).to.be.a("number");

      expect(createdAt).to.be.a("string");
      expect(updatedAt).to.be.a("string");
    });

    describe("errors", () => {
      describe("body validation", () => {
        describe("name", () => {
          it("should return 400 when name is not present", async () => {
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -104,
              expectedMessage:
                "Bad Request: data must have required property 'name'",
              response: await createVideo({
                ...videoPayload(),
                name: undefined,
              }),
            });
          });
          it("should return 400 when name is not string", async () => {
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -104,
              expectedMessage: "Bad Request: data/name must be string",
              response: await createVideo({
                ...videoPayload(),
                name: 1232,
              }),
            });
          });
        });
        describe("url", () => {
          it("should return 400 when url is not present", async () => {
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -104,
              expectedMessage:
                "Bad Request: data must have required property 'url'",
              response: await createVideo({
                ...videoPayload(),
                url: undefined,
              }),
            });
          });
          it("should return 400 when url is not string", async () => {
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -104,
              expectedMessage: "Bad Request: data/url must be string",
              response: await createVideo({ ...videoPayload(), url: 1234 }),
            });
          });

          it("should return 400 when url is not url format", async () => {
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -104,
              expectedMessage: 'Bad Request: data/url must match format "url"',
              response: await createVideo({
                ...videoPayload(),
                url: "s".repeat(50),
              }),
            });
          });
        });
        describe("thumbnail", () => {
          it("should return 400 when thumbnail is not present", async () => {
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -104,
              expectedMessage:
                "Bad Request: data must have required property 'thumbnailUrl'",
              response: await createVideo({
                ...videoPayload(),
                thumbnailUrl: undefined,
              }),
            });
          });
          it("should return 400 when thumbnail is not string", async () => {
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -104,
              expectedMessage: "Bad Request: data/thumbnailUrl must be string",
              response: await createVideo({
                ...videoPayload(),
                thumbnailUrl: 1234,
              }),
            });
          });
          it("should return 400 when thumbnail is not url format", async () => {
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -104,
              expectedMessage:
                'Bad Request: data/thumbnailUrl must match format "url"',
              response: await createVideo({
                ...videoPayload(),
                thumbnailUrl: "s".repeat(50),
              }),
            });
          });
        });
        describe("isPrivate", () => {
          it("should return 400 when isPrivate is not present", async () => {
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -104,
              expectedMessage:
                "Bad Request: data must have required property 'isPrivate'",
              response: await createVideo({
                ...videoPayload(),
                isPrivate: undefined,
              }),
            });
          });
          it("should return 400 when isPrivate is not a boolean", async () => {
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -104,
              expectedMessage: "Bad Request: data/isPrivate must be boolean",
              response: await createVideo({
                ...videoPayload(),
                isPrivate: "notboolean",
              }),
            });
          });
        });
      });
    });
  });
});
