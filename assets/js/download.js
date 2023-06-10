$(document).ready(function () {
    var repoOwner = "ForkMC";
    var repoName = "Fork";
    var apiUrl = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/releases";
  
    // Function to load releases
    function loadReleases() {
      $.getJSON(apiUrl, function (data) {
        var releases = data.map(function (release) {
          return {
            name: release.name,
            description: release.body,
            downloadUrl: release.assets.length > 0 ? release.assets[0].browser_download_url : null,
            isPrerelease: release.prerelease
          };
        });
  
        // Sort releases by published date (latest first)
        releases.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date);
        });
  
        // Display latest release
        var latestRelease = releases[0];
        if (latestRelease) {
          var releaseTitle = latestRelease.isPrerelease ? "EXPERIMENTAL - " + latestRelease.name : latestRelease.name;
          var releaseHTML = `
            <div class="release-item">
              <h3 class="release-title">${releaseTitle}</h3>
              <p class="release-description">${latestRelease.description}</p>
              <a href="${latestRelease.downloadUrl}" class="download-button">Download</a>
            </div>
          `;
          $("#latest-downloads").append(releaseHTML);
        }
  
        // Toggle older builds
        $("#toggle-button").on("click", function () {
          $("#older-releases").toggleClass("hidden");
          var buttonText = $("#toggle-button").text();
          buttonText = buttonText === "Show Older Builds" ? "Hide Older Builds" : "Show Older Builds";
          $("#toggle-button").text(buttonText);
        });
  
        // Display older releases
        var olderReleases = releases.slice(1);
        olderReleases.forEach(function (release) {
          var releaseTitle = release.isPrerelease ? "EXPERIMENTAL - " + release.name : release.name;
          var releaseHTML = `
            <div class="release-item">
              <h3 class="release-title">${releaseTitle}</h3>
              <p class="release-description">${release.description}</p>
              <a href="${release.downloadUrl}" class="download-button">Download</a>
            </div>
          `;
          $("#older-downloads").append(releaseHTML);
        });
      });
    }
  
    loadReleases();
  });
  