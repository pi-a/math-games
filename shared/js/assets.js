// assets.js
// -----------------------------------------------------------------------

function loadImageAsset(imgElement, baseName) {
  const extensions = CONFIG.assetExtensions;
  let attempt = 0;

  function tryNext() {
    if (attempt >= extensions.length) {
      imgElement.removeEventListener("error", tryNext);
      imgElement.classList.add("asset-missing");
      imgElement.removeAttribute("src");
      return;
    }
    const ext = extensions[attempt];
    attempt += 1;
    imgElement.src = CONFIG.assetsPath + baseName + "." + ext;
  }

  imgElement.classList.remove("asset-missing");
  imgElement.addEventListener("error", tryNext);
  tryNext();
}
