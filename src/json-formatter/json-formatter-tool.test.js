require("./json-formatter-tool");

describe("JsonFormatterTool", () => {
  let jsonFormatterTool;
  let inputArea;
  let outputArea;
  let formatBtn;
  let copyBtn;
  let downloadBtn;
  let copyNotification;
  let downloadNotification;

  beforeEach(() => {
    document.body.innerHTML = `
        <json-formatter-tool></json-formatter-tool>
      `;

    // Get references to elements inside the custom element
    jsonFormatterTool = document.querySelector("json-formatter-tool");
    inputArea = jsonFormatterTool.querySelector(".input-area");
    outputArea = jsonFormatterTool.querySelector(".output-area");
    formatBtn = jsonFormatterTool.querySelector(".format-btn");
    copyBtn = jsonFormatterTool.querySelector(".copy-btn");
    downloadBtn = jsonFormatterTool.querySelector(".download-btn");
    copyNotification = jsonFormatterTool.querySelector(
      ".copy-btn-container .notification",
    );
    downloadNotification = jsonFormatterTool.querySelector(
      ".download-btn-container .notification",
    );
  });

  // tool render test
  test("Should render the JSON formatter tool correctly", () => {
    expect(inputArea).toBeTruthy();
    expect(formatBtn).toBeTruthy();
    expect(outputArea).toBeTruthy();
    expect(copyBtn).toBeTruthy();
    expect(downloadBtn).toBeTruthy();
    expect(copyNotification).toBeTruthy();
    expect(downloadNotification).toBeTruthy();
  });

  // simple JSON formatting test
  test("should format JSON correctly when valid JSON is entered", () => {
    // Input valid JSON and trigger the format button
    inputArea.value = '{"name": "Dylan Lukes", "age": 30}';
    formatBtn.click();

    // Check that the output area contains formatted JSON
    expect(outputArea.value).toBe(
      '{\n  "name": "Dylan Lukes",\n  "age": 30\n}',
    );
  });

  // complex JSON formatting test
  test("should format a more complex json input correctly when valid JSON is entered", () => {
    inputArea.value =
      '{ "id":12345,"name":"John Doe", "email": "johndoe@example.com" , "address" : { "street":"123 Main St","city": "Somewhere" , "zipcode":12345} ,"phones" :[ { "type" : "mobile","number" :"123-456-7890" },{ "type": "home" , "number":"098-765-4321"} ], "preferences" : {"contactMethod" :"email", "newsletter":true}}';
    formatBtn.click();

    expect(outputArea.value).toBe(
      '{\n  "id": 12345,\n  "name": "John Doe",\n  "email": "johndoe@example.com",\n  "address": {\n    "street": "123 Main St",\n    "city": "Somewhere",\n    "zipcode": 12345\n  },\n  "phones": [\n    {\n      "type": "mobile",\n      "number": "123-456-7890"\n    },\n    {\n      "type": "home",\n      "number": "098-765-4321"\n    }\n  ],\n  "preferences": {\n    "contactMethod": "email",\n    "newsletter": true\n  }\n}',
    );
  });

  // empty input test
  test("should stay empty on empty input", () => {
    inputArea = "";
    formatBtn.click();

    //The output should be empty
    expect(outputArea.value).toBe("");
  });

  // invalid JSON error test
  test("should indicate error on invalid JSON", () => {
    inputArea.value = '{"name": "Dylan Lukes", "age": 30';
    formatBtn.click();

    // Check that the output area shows the error
    expect(outputArea.value).toMatch(/Error/);
  });

  // successful copy button test
  test("should alert a successful copy of formatted JSON", async () => {
    // Make the test async
    const showNotificationMock = jest
      .spyOn(jsonFormatterTool, "showNotification")
      .mockImplementation(() => {});

    // Successful copy to clipboard
    const clipboardMock = jest.fn().mockResolvedValue();
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: clipboardMock,
      },
      writable: true,
    });
    outputArea.value = '{\n  "name": "Dylan Lukes",\n  "age": 30\n}';
    await copyBtn.click();
    expect(clipboardMock).toHaveBeenCalledWith(
      '{\n  "name": "Dylan Lukes",\n  "age": 30\n}',
    );
    expect(showNotificationMock).toHaveBeenCalledWith(
      jsonFormatterTool.copyNotification,
      "Copied to clipboard!",
    );
  });

  // empty output copy alert test
  test("should alert when copying with no formatted JSON", () => {
    // Mock the showNotification method
    const showNotificationMock = jest
      .spyOn(jsonFormatterTool, "showNotification")
      .mockImplementation(() => {});
    outputArea.value = "";
    copyBtn.click();

    // Assert that showNotification was called with the correct arguments
    expect(showNotificationMock).toHaveBeenCalledWith(
      jsonFormatterTool.copyNotification,
      "Nothing to copy!",
    );
  });

  // successful file download test
  test("should trigger file download when formatted JSON exists", () => {
    // Mock the creation of anchor element
    const mockAnchor = {
      click: jest.fn(),
      href: "",
      download: "",
    };

    const createElementSpy = jest
      .spyOn(document, "createElement")
      .mockImplementation(() => mockAnchor);

    // Mock URL.createObjectURL and revokeObjectURL
    const mockCreateObjectURL = jest.fn().mockReturnValue("blob:mock-url");
    const mockRevokeObjectURL = jest.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    // Set up test data
    outputArea.value = '{"name": "John"}';
    downloadBtn.click();

    // Assertions
    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(mockAnchor.download).toBe("formatted.json");
    expect(mockAnchor.click).toHaveBeenCalled();
    expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  // empty output download alert test
  test("Should alert if trying to download without formatted JSON", () => {
    const showNotificationMock = jest
      .spyOn(jsonFormatterTool, "showNotification")
      .mockImplementation(() => {});
    outputArea.value = "";
    downloadBtn.click();
    expect(showNotificationMock).toHaveBeenCalledWith(
      jsonFormatterTool.downloadNotification,
      "No JSON to download!",
    );
  });

  // JS cleanup on close test
  test("Should handle cleanup correctly when disconnected", () => {
    const removeEventListenerSpy = jest.spyOn(formatBtn, "removeEventListener");
    jsonFormatterTool.remove();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
    );
  });

  test("Should disable the copy and download buttons on error", () => {
    inputArea.value = '{"name": "Dylan Lukes", "age": 30';
    formatBtn.click();
    // Check that the output area shows the error
    expect(outputArea.value).toMatch(/Error/);

    // Check that the copy and download buttons are disabled
    expect(copyBtn.disabled).toBe(true);
    expect(downloadBtn.disabled).toBe(true);
  });

  test("Should enable the copy and download buttons after error when valid input is formatted", () => {
    inputArea.value = '{"name": "Dylan Lukes", "age": 30';
    formatBtn.click();
    // Check that the output area shows the error
    expect(outputArea.value).toMatch(/Error/);

    // Check that the copy and download buttons are disabled
    expect(copyBtn.disabled).toBe(true);
    expect(downloadBtn.disabled).toBe(true);

    // Check that the copy and download buttons are enabled
    inputArea.value = '{\n  "name": "Dylan Lukes",\n  "age": 30\n}';
    formatBtn.click();
    expect(copyBtn.disabled).toBe(false);
    expect(downloadBtn.disabled).toBe(false);
  });
});
