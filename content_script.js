if (window.location.hostname === "ilearn.csumb.edu") {
  ///////////////////////////////////////////////////////////////////////
  //  ilearn.csumb.edu customization
  //
  // 1. moves module list to the top of sidebar
  // 2. makes module headers clickable
  // 3. makes modules collabsible
  // 4. restores state of collapsed modules
  //
  ///////////////////////////////////////////////////////////////////////

  const COLLAPSED_CLASS_NAME = "collapsed";
  const LOCAL_STORAGE_KEY = "collapsedModules";

  const sidebar = document.querySelector("#block-region-side-pre");
  const moduleLinks = document.querySelector("#inst194708");
  const sectionHeaders = document.querySelectorAll(".section .sectionname");

  const isArray = arr => typeof arr !== "undefined" || arr instanceof Array;

  // move module navigation to the top of the sidebar
  sidebar.insertBefore(moduleLinks, sidebar.firstChild);

  // restore collapsed module state from local storage
  chrome.storage.local.get(LOCAL_STORAGE_KEY, function(result) {
    if (isArray(result[LOCAL_STORAGE_KEY])) {
      result[LOCAL_STORAGE_KEY].forEach(id => {
        const sectionHeader = document.querySelector(`#${id} .sectionname`);
        const collapsibleContent = document.querySelectorAll(
          `#${id} .summary, #${id} .section`
        );
        sectionHeader.classList.add(COLLAPSED_CLASS_NAME);
        collapsibleContent.forEach(el => (el.style.display = "none"));
      });
    }
  });

  // handle clicks on section header
  const handleSectionHeaderClick = sectionHeader => {
    const sectionId = sectionHeader.closest(".section").id;
    const isCollapsed = sectionHeader.classList.contains(COLLAPSED_CLASS_NAME);
    const collapsibleContent = sectionHeader
      .closest(".content")
      .querySelectorAll(".summary, .section");
    chrome.storage.local.get(LOCAL_STORAGE_KEY, function(result) {
      if (!isArray(result[LOCAL_STORAGE_KEY])) {
        result[LOCAL_STORAGE_KEY] = [];
      }

      if (result[LOCAL_STORAGE_KEY].includes(sectionId)) {
        // uncollapse
        result[LOCAL_STORAGE_KEY] = result[LOCAL_STORAGE_KEY].filter(
          module => module !== sectionId
        );
        chrome.storage.local.set(result, function() {
          sectionHeader.classList.remove(COLLAPSED_CLASS_NAME);
          collapsibleContent.forEach(el => (el.style.display = "block"));
        });
      } else {
        // collapse
        result[LOCAL_STORAGE_KEY].push(sectionId);
        chrome.storage.local.set(result, function() {
          sectionHeader.classList.add(COLLAPSED_CLASS_NAME);
          collapsibleContent.forEach(el => (el.style.display = "none"));
        });
      }
    });
  };

  // when user clicks module header
  sectionHeaders.forEach(sectionHeader => {
    sectionHeader.style.cursor = "pointer";
    sectionHeader.onclick = () => handleSectionHeaderClick(sectionHeader);
  });
} else if (window.location.hostname === "www.mindtools.com") {
  ///////////////////////////////////////////////////////////////////////
  //  www.mindtools.com customization
  //
  // 1. disables content stubbing
  //
  ///////////////////////////////////////////////////////////////////////

  // reveal stubbed content
  const stubbedElements = document.querySelectorAll(".stubbed");
  stubbedElements.forEach(el => el.classList.remove("stubbed"));
}
