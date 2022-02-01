const { expect } = require("chai");
const start = require("../../app");
const expectError = require("../drivers/expectError");

const {
  videoPayload,
  createVideo,
  updateVideo,
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

  describe("PUT", () => {
    it("should update and return video", async () => {
      const createResponse = await createVideo(videoPayload());
      const { id } = await createResponse.json();
      const updateVideoPayload = videoPayload();
      const response = await updateVideo(id, updateVideoPayload);

      const {
        id: updateId,
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
      expect(updateId).to.equal(id);

      expect(name).to.equal(updateVideoPayload.name);
      expect(name).to.be.a("string");

      expect(url).to.be.a("string");
      expect(url).to.equal(updateVideoPayload.url);

      expect(thumbnailUrl).to.be.a("string");
      expect(thumbnailUrl).to.equal(updateVideoPayload.thumbnailUrl);

      expect(isPrivate).to.be.a("boolean");
      expect(isPrivate).to.equal(updateVideoPayload.isPrivate);

      expect(timesViewed).to.be.a("number");

      expect(createdAt).to.be.a("string");
      expect(updatedAt).to.be.a("string");
    });

    describe("errors", () => {
      it("should return 404 for non existant video", async () => {
        await expectError({
          expectedStatusCode: 404,
          expectedCode: -106,
          expectedMessage: "Not Found",
          response: await updateVideo(-1, videoPayload()),
        });
      });
      describe("body validation", () => {
        describe("name", () => {
          it("should return 400 when name is not present", async () => {
            const payload = {
              ...videoPayload(),
              name: undefined,
            };
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -105,
              expectedMessage:
                "Bad Request: data must have required property 'name'",
              response: await updateVideo(-1, payload),
            });
          });
          it("should return 400 when name is not string", async () => {
            const payload = {
              ...videoPayload(),
              name: 1232,
            };
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -105,
              expectedMessage: "Bad Request: data/name must be string",
              response: await updateVideo(-1, payload),
            });
          });
        });
        describe("url", () => {
          it("should return 400 when url is not present", async () => {
            const payload = {
              ...videoPayload(),
              url: undefined,
            };
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -105,
              expectedMessage:
                "Bad Request: data must have required property 'url'",
              response: await updateVideo(-1, payload),
            });
          });
          it("should return 400 when url is not string", async () => {
            const payload = { ...videoPayload(), url: 1234 };
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -105,
              expectedMessage: "Bad Request: data/url must be string",
              response: await updateVideo(-1, payload),
            });
          });
          it("should return 400 when url is not url format", async () => {
            const payload = {
              ...videoPayload(),
              url: "s".repeat(50),
            };
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -105,
              expectedMessage: 'Bad Request: data/url must match format "url"',
              response: await updateVideo(-1, payload),
            });
          });
        });
        describe("thumbnail", () => {
          it("should return 400 when thumbnail is not present", async () => {
            const payload = {
              ...videoPayload(),
              thumbnailUrl: undefined,
            };
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -105,
              expectedMessage:
                "Bad Request: data must have required property 'thumbnailUrl'",
              response: await updateVideo(-1, payload),
            });
          });
          it("should return 400 when thumbnail is not string", async () => {
            const payload = {
              ...videoPayload(),
              thumbnailUrl: 1234,
            };
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -105,
              expectedMessage: "Bad Request: data/thumbnailUrl must be string",
              response: await updateVideo(-1, payload),
            });
          });
          it("should return 400 when thumbnail is not url format", async () => {
            const payload = {
              ...videoPayload(),
              thumbnailUrl: "s".repeat(50),
            };
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -105,
              expectedMessage:
                'Bad Request: data/thumbnailUrl must match format "url"',
              response: await updateVideo(-1, payload),
            });
          });
        });
        describe("isPrivate", () => {
          it("should return 400 when isPrivate is not present", async () => {
            const payload = {
              ...videoPayload(),
              isPrivate: undefined,
            };
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -105,
              expectedMessage:
                "Bad Request: data must have required property 'isPrivate'",
              response: await updateVideo(-1, payload),
            });
          });
          it("should return 400 when isPrivate is not a boolean", async () => {
            const payload = {
              ...videoPayload(),
              isPrivate: "notboolean",
            };
            await expectError({
              expectedStatusCode: 400,
              expectedCode: -105,
              expectedMessage: "Bad Request: data/isPrivate must be boolean",
              response: await updateVideo(-1, payload),
            });
          });
        });
      });
    });
  });
});
