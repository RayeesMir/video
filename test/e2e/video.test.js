const { expect } = require("chai");
const start = require("../../app");
const expectError = require("../drivers/expectError");

const {
  videoPayload,
  createVideo,
  createAndReturnVideo,
  updateVideo,
  fetchVideos,
  listVideos,
  updateViews,
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

  describe("GET", () => {
    it("should return list of video", async () => {
      const response = await fetchVideos();

      expect(response.status).to.equal(200);

      const { videos, totalCount, pageCount, limit } = await response.json();

      expect(totalCount).to.not.be.undefined;
      expect(totalCount).to.be.a("number");

      expect(pageCount).to.not.be.undefined;
      expect(pageCount).to.be.a("number");

      expect(limit).to.not.be.undefined;
      expect(limit).to.be.a("number");

      expect(videos).to.not.be.undefined;
      expect(videos).to.be.an("array");

      expect(videos.every((video) => video.id !== undefined)).to.equal(true);

      expect(videos.every(({ name }) => name !== undefined)).to.equal(true);
    });
    describe("filters", () => {
      describe("isPrivate", () => {
        it("should filter public videos only", async () => {
          const { videos } = await listVideos("isPrivate=bool:false");
          expect(videos.every((video) => video.isPrivate === false)).to.equal(
            true
          );
        });
      });
      describe("timesViewed", () => {
        describe("exact", () => {
          it("should filter videos with exact 10 views", async () => {
            const { id } = await createAndReturnVideo();
            await updateViews(id, 10);
            const { videos } = await listVideos("timesViewed=exact:10");
            expect(
              videos.every(({ timesViewed }) => timesViewed === 10)
            ).to.equal(true);
          });
        });
        describe("gt", () => {
          it("should filter videos with gt 10 views", async () => {
            const { id } = await createAndReturnVideo();
            await updateViews(id, 11);
            const { videos } = await listVideos("timesViewed=gt:10");
            expect(
              videos.every(({ timesViewed }) => timesViewed > 10)
            ).to.equal(true);
          });
        });
        describe("gte", () => {
          it("should filter videos with gte 10 views", async () => {
            const { id } = await createAndReturnVideo();
            await updateViews(id, 10);
            await updateViews(id, 11);
            const { videos } = await listVideos("timesViewed=gte:10");
            expect(
              videos.every(({ timesViewed }) => timesViewed >= 10)
            ).to.equal(true);
          });
        });
        describe("lt", () => {
          it("should filter videos with lt 10 views", async () => {
            const { id } = await createAndReturnVideo();
            await updateViews(id, 9);
            const { videos } = await listVideos("timesViewed=lt:10");
            expect(
              videos.every(({ timesViewed }) => timesViewed < 10)
            ).to.equal(true);
          });
        });
        describe("lte", () => {
          it("should filter videos with lte 10 views", async () => {
            const { id } = await createAndReturnVideo();
            await updateViews(id, 9);
            await updateViews(id, 10);
            const { videos } = await listVideos("timesViewed=lte:10");
            expect(
              videos.every(({ timesViewed }) => timesViewed <= 10)
            ).to.equal(true);
          });
        });
      });
      describe("meta", () => {
        it("should return correct filter", async () => {
          const { isPrivate } = await listVideos("isPrivate=bool:true");
          expect(isPrivate).to.deep.equal([{ filter: "bool", value: "true" }]);
        });
      });
    });
    describe("pagination", () => {
      it("should return 20 video by default", async () => {
        const { limit, videos } = await listVideos();
        expect(limit).to.equal(20);
        expect(videos.length).lte(20);
      });

      it("should return 10 videos when limit is set to 10", async () => {
        const { videos, limit } = await listVideos("limit=10");
        expect(limit).to.equal(10);
        expect(videos.length).to.lte(10);
      });

      it("should return empty videos array when limit is set to 0", async () => {
        const { videos, limit } = await listVideos("limit=0");
        expect(videos.length).to.equal(0);
        expect(limit).to.equal(0);
      });

      it("should return first page by default", async () => {
        const { page } = await listVideos();
        expect(page).to.equal(0);
      });

      it("should return same exact page when changing page", async () => {
        const { videos: firstPageVideos } = await listVideos("limit=6");
        const lastVideoOfFirstPage = firstPageVideos[5];
        const { videos: secondPageVideos } = await listVideos("limit=5&page=1");
        const firstVideoOfSecondPage = secondPageVideos[0];
        expect(lastVideoOfFirstPage).to.deep.equal(firstVideoOfSecondPage);
      });

      describe("meta", () => {
        it("should return correct limit", async () => {
          const { limit } = await listVideos("limit=3");
          expect(limit).to.equal(3);
        });

        it("should return correct page", async () => {
          const { page } = await listVideos("page=3");
          expect(page).to.equal(3);
        });

        it("should return correct filter", async () => {
          const { isPrivate } = await listVideos("isPrivate=bool:true");
          expect(isPrivate).to.deep.equal([{ filter: "bool", value: "true" }]);
        });

        it("should return correct page count", async () => {
          const { pageCount, limit, totalCount } = await listVideos("limit=10");
          expect(pageCount).to.equal(Math.ceil(totalCount / limit));
        });

        it("should return correct total count after video is created", async () => {
          const { totalCount: firstTotalCount } = await listVideos();
          await createAndReturnVideo();
          const { totalCount: secondTotalCount } = await listVideos();
          expect(secondTotalCount).to.be.eq(firstTotalCount + 1);
        });
      });
    });
  });

});
