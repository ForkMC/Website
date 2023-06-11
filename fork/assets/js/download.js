$(document).ready(function () {
  var repoOwner = "ForkMC";
  var repoName = "Fork";
  var apiUrl = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/releases";

  // Function to load releases
  function loadReleases() {
    $.getJSON(apiUrl, function (data) {
      var releases = data.map(function (release) {
        var commitHash = release.target_commitish.slice(0, 7); // Get the first 7 characters of the commit hash
        return {
          name: release.name,
          description: release.body,
          downloadUrl: release.assets.length > 0 ? release.assets[0].browser_download_url : null,
          isPrerelease: release.prerelease,
          commitHash: commitHash
        };
      });

      // Sort releases by published date (latest first)
      releases.sort(function (a, b) {
        return new Date(b.published_at) - new Date(a.published_at);
      });

      displayReleases(releases);
    });
  }

  // Function to display releases
  function displayReleases(releases) {
    // Display latest release
    var latestRelease = releases.find(function (release) {
      return !release.isPrerelease;
    });

    if (latestRelease) {
      var releaseTitle = latestRelease.name;
      if (latestRelease.isPrerelease) {
        releaseTitle = `${releaseTitle}`;
      }
      var releaseHash = `"${latestRelease.commitHash}"`;

      var releaseHTML = `
        <div class="release-item">
          <p class="commit-hash"><i class="fas fa-check"></i> git-Fork-${releaseHash}</p>
          <h3 class="release-title">${releaseTitle}</h3>
          <p class="release-description">${latestRelease.description}</p>
          <a href="${latestRelease.downloadUrl}" class="download-button">Download</a>
        </div>
      `;
      $("#latest-downloads").append(releaseHTML);
    }

    // Display older releases
    var olderReleases = releases.filter(function (release) {
      return !release.isPrerelease;
    });

    olderReleases.slice(1).forEach(function (release) {
      var releaseTitle = release.name;
      if (release.isPrerelease) {
        releaseTitle = `<i class="fas fa-flask"></i> ${releaseTitle}`;
      }
      var releaseHash = `"${release.commitHash}"`;

      var releaseHTML = `
        <div class="release-item older-build">
          <p class="commit-hash"><i class="fas fa-check"></i> git-Fork-${releaseHash}</p>
          <h3 class="release-title">${releaseTitle}</h3>
          <p class="release-description">${release.description}</p>
          <a href="${release.downloadUrl}" class="download-button">Download</a>
        </div>
      `;
      $("#older-downloads").append(releaseHTML);
    });

    // Display experimental releases
    var experimentalReleases = releases.filter(function (release) {
      return release.isPrerelease;
    });

    experimentalReleases.forEach(function (release) {
      var releaseTitle = release.name;
      var releaseHash = `"${release.commitHash}"`;

      var releaseHTML = `
        <div class="release-item">
          <p class="commit-hash-experimental"><i class="fas fa-exclamation-triangle"></i> git-Fork-${releaseHash}</p>
          <h3 class="release-title">${releaseTitle}</h3>
          <p class="release-description">${release.description}</p>
          <a href="${release.downloadUrl}" class="download-button">Download</a>
        </div>
      `;
      $("#experimental-downloads").append(releaseHTML);
    });

    // Hide older builds initially
    $(".older-build").hide();
    $(".hide-button").hide();
  }

  loadReleases();

  // Tab click event handlers
  $(".tab").on("click", function () {
    var tabId = $(this).attr("id");
    $(".tab").removeClass("active");
    $(this).addClass("active");
    $(".content").hide();
    $("#" + tabId.replace("-tab", "-content")).show();
  });

  // Show older builds
  $(".show-button").on("click", function () {
    $("#older-releases h2").show();
    $("#older-releases .older-build").show();
    $(".show-button").hide();
    $(".hide-button").show();
  });

  // Hide older builds
  $(".hide-button").on("click", function () {
    $("#older-releases h2").hide();
    $("#older-releases .older-build").hide();
    $(".hide-button").hide();
    $(".show-button").show();
  });
});