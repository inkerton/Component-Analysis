const sbomData = [
  {
    type: "application",
    name: "My App",
    version: "1.0.0",
    purl: "pkg:npm/my-app@1.0.0",
    dependencies: [
      {
        type: "library",
        name: "express",
        version: "4.17.1",
        purl: "pkg:npm/express@4.17.1",
        dependencies: [
          {
            type: "library",
            name: "dep-1",
            version: "1.0.0",
            purl: "pkg:npm/dep-1@1.0.0",
            dependencies: [
              {
                type: "library",
                name: "nested-dep-1",
                version: "2.0.0",
                purl: "pkg:npm/nested-dep-1@2.0.0",
              },
            ],
          },
        ],
      },
      {
        type: "library",
        name: "react",
        version: "17.0.2",
        purl: "pkg:npm/react@17.0.2",
        dependencies: [
          {
            type: "library",
            name: "dep-2",
            version: "3.0.0",
            purl: "pkg:npm/dep-2@3.0.0",
            dependencies: [
              {
                type: "library",
                name: "nested-dep-2",
                version: "4.0.0",
                purl: "pkg:npm/nested-dep-2@4.0.0",
              },
              {
                type: "library",
                name: "nested-dep-3",
                version: "5.0.0",
                purl: "pkg:npm/nested-dep-3@5.0.0",
              },
            ],
          },
        ],
      },
      {
        type: "library",
        name: "library-3",
        version: "6.0.0",
        purl: "pkg:npm/library-3@6.0.0",
        dependencies: [
          {
            type: "library",
            name: "dep-3",
            version: "7.0.0",
            purl: "pkg:npm/dep-3@7.0.0",
            dependencies: [
              {
                type: "library",
                name: "nested-dep-4",
                version: "8.0.0",
                purl: "pkg:npm/nested-dep-4@8.0.0",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    type: "application",
    name: "Flask Server",
    version: "2.0.0",
    purl: "pkg:npm/my-flask@2.0.0",
    dependencies: [
      {
        type: "testing python library",
        name: "pythontesting",
        version: "4.17.1",
        purl: "pkg:npm/express@4.17.1",
        dependencies: [],
      },
      {
        type: "testing python library",
        name: "pythontesting",
        version: "4.17.1",
        purl: "pkg:npm/express@4.17.1",
        dependencies: [],
      },
      {
        type: "testing python library",
        name: "pythontesting",
        version: "4.17.1",
        purl: "pkg:npm/express@4.17.1",
        dependencies: [],
      },
    ],
  },
  {
    type: "application",
    name: "javaWebView",
    version: "2.0.0",
    purl: "pkg:npm/java@2.0.0",
    dependencies: [
      {
        type: "testing java library",
        name: "javaTesting",
        version: "4.17.1",
        purl: "pkg:npm/java@4.17.1",
        dependencies: [],
      },
      {
        type: "testing java library",
        name: "javaTesting",
        version: "4.17.1",
        purl: "pkg:npm/java@4.17.1",
        dependencies: [],
      },
      {
        type: "testing java library",
        name: "javaTesting",
        version: "4.17.1",
        purl: "pkg:npm/java@4.17.1",
        dependencies: [],
      },
    ],
  },
];

export const stringiefiedSbomData = JSON.stringify(sbomData);
