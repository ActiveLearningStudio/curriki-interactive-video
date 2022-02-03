if (typeof H5PEditor !== 'undefined') {
  H5PEditor.widgets.interactiveVideo = H5PEditor.CurrikiInteractiveVideo = (function (
    $
  ) {
    setTimeout(() => {
      var $wrapper = $("body .h5peditor")
        .children()
        .find(".content")
        .children(".field-name-files")
        .children(".h5p-dialog-anchor");
      var dialogUrlInputWraper = $wrapper.find(".h5p-file-url-wrapper");
      var playlistButton =
        '<div class="h5p-playlist-button-wrapper">' +
        '<button class="loadPlaylist">Load Media</button></div>';
      dialogUrlInputWraper.append(playlistButton);

      var playlistModalWraper =
        '<div id="playlistContent" class="modal">' +
        '<div class="modal-content">' +
        '<span class="close">&times;</span>' +
        '<div class="tabset">' +
        '<input type="radio" name="tabset" id="kaltura" aria-controls="kalturaPlaylist" checked>' +
        '<label for="kaltura">Kaltura</label>' +
        '<input type="radio" name="tabset" id="youtube" aria-controls="youtubePlaylist">' +
        '<label for="youtube">Youtube</label>' +
        '<input type="radio" name="tabset" id="vimeo" aria-controls="vimeoPlaylist">' +
        '<label for="vimeo">Vimeo</label>' +
        /*'<input type="radio" name="tabset" id="lti-tool-settings" aria-controls="ltiToolPlaylist">' +
        '<label for="lti-tool-settings">LTI Tools</label>' +*/
        '<input type="hidden" id="current_page" />' +
        '<input type="hidden" id="show_per_page" />' +
        '<section id="kalturaPlaylist" class="tab-panel">' +
        '<div class="search-playlist">' +
        '<input type="text" placeholder="search" data-search id="input-playlist" />' +
        "</div>" +
        '<div id="modalContent" class="play-lists"></div>' +
        "<nav>" +
        '<ul class="pagination justify-content-center pagination-sm kaltura-pagination" id="page_navigation"></ul>' +
        "</nav>" +
        "</section>" +
        '<section id="youtubePlaylist" class="tab-panel">' +
        '<div class="search-playlist">' +
        '<input type="text" placeholder="search" data-search id="youtubeSearchInput" />' +
        "</div>" +
        '<div id="youtubePlaylistWraper" class="play-lists"></div>' +
        "<nav>" +
        '<ul class="pagination justify-content-center pagination-sm youtube-pagination" id="youtube_navigation"></ul>' +
        "</nav>" +
        "</section>" +
        '<section id="vimeoPlaylist" class="tab-panel">' +
        '<div class="search-playlist">' +
        '<input type="text" placeholder="search" data-search id="vimeoSearchInput" />' +
        "</div>" +
        '<div id="vimeoPlaylistWraper" class="play-lists"></div>' +
        "<nav>" +
        '<ul class="pagination justify-content-center pagination-sm vimeo-pagination" id="vimeo_navigation"></ul>' +
        "</nav>" +
        "</section>" +
        '<section id="ltiToolPlaylist" class="tab-panel">' +
        '<div class="search-playlist">' +
        '<select class="custom-select" id="ltiToolSettingsSelect"></select>' +
        "</div>" +
        '<div id="loaderDiv" class=""><nav><div id="lti-tool-settings-content" class="play-lists"></div></nav></div>' +
        "</section>" +
        "</div>" +
        "</div>" +
        "</div>";
      // var inputUrlWraper = $wrapper.children().children().find(".h5p-dialog-box");
      $(".h5p-add-dialog-table").append(playlistModalWraper);

      var $loadPlaylist = dialogUrlInputWraper.find(".loadPlaylist");
      $loadPlaylist.click(function () {
        var modal = document.getElementById("playlistContent");
        modal.style.display = "block";
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
          modal.style.display = "none";
        };
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        };
        var totalVideoCount;
        var kalturaPageLength = 5;
        async function getPlaylistData(pageSize, pageIndex, searchText) {
          $.ajax({
            type: "POST",
            dataType: "json",
            data: {
              pageSize: pageSize,
              pageIndex: pageIndex,
              searchText: searchText
            },
            url: KalturaConfig.apiPath,
            success: function (data) { console.log('respData:',data);
              // data = $.parseJSON(data);
              // console.log(data);
              if (data.results) {
                var results = data.results;
                totalVideoCount = results.totalCount;
                document.getElementById("modalContent").innerHTML = "";
                results.objects.forEach(function (item, index) {
                  var node =
                    '<div class="play-item" data-filter-item data-filter-name="' +
                    item.name.toLowerCase() +
                    '">' +
                    '<img class="play-list-video" src="' +
                    item.thumbnailUrl +
                    '" width=250 height=250 data-url="' +
                    item.dataUrl +
                    '">' +
                    '<span class="kaltura-video-title">' +
                    item.name +
                    "</span>" +
                    "</div>";
                  document.getElementById("modalContent").innerHTML += node;
                });

                $(document).on("click", ".play-list-video", function () {
                  $(".h5p-file-url").val($(this).data("url"));
                  $(".modal").css("display", "none");
                });
              } else {
                console.log(data.error);
              }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              var errorMessage = '';
              if (XMLHttpRequest.responseJSON.message) {
                errorMessage = XMLHttpRequest.responseJSON.message;
              } else if (XMLHttpRequest.responseJSON.errors){
                errorMessage = XMLHttpRequest.responseJSON.errors[0];
              }              
              var node =
                  '<div class="play-item" data-filter-item><span class="kaltura-video-title">'+errorMessage+'</span></div>';
                document.getElementById("modalContent").innerHTML = node;
            }
          });
        }

        function addPagination(perPageItem, videoCountNumber, listWraper) {
          //Pagination JS
          //how much items per page to show
          var show_per_page = perPageItem;
          //getting the amount of elements inside pagingBox div
          var number_of_items = videoCountNumber;
          //calculate the number of pages we are going to have
          var number_of_pages = Math.ceil(number_of_items / show_per_page);

          //set the value of our hidden input fields
          $("#current_page").val(0);
          $("#show_per_page").val(show_per_page);
          if (videoCountNumber > kalturaPageLength) {
            //now when we got all we need for the navigation let's make it '
            if (listIndex == 0) {
              var navigation_html =
              '<li class="page-item"><a style="display:none;" class="previous_link page-link" href="javascript:void(0);">Prev</a></li>';
            } else {
              var navigation_html =
              '<li class="page-item"><a class="previous_link page-link" href="javascript:void(0);">Prev</a></li>';
            }
            var current_link = 0;
            // while (number_of_pages > current_link) {
            //   navigation_html +=
            //     '<li class="page-item page_item" longdesc="' +
            //     current_link +
            //     '"><a class="page_link page-link"' +
            //     'href="javascript:void(0)">' +
            //     (current_link + 1) +
            //     "</a></li>";
            //   current_link++;
            // }
            navigation_html +=
              '<li class="page-item"><a class="next_link page-link" href="javascript:void(0);">Next</a></li>';
            $("#" + listWraper).html(navigation_html);
            //add active class to the first page link
            $("#" + listWraper + " .page_item:first").addClass("active");
          }
          //hide all the elements inside pagingBox div
          $("#modalContent").children().css("display", "none");
          //and show the first n (show_per_page) elements
          $("#modalContent")
            .children()
            .slice(0, show_per_page)
            .css("display", "inline-block");
          //Pagination JS
        }
        function go_to_page(page_num, listWraper) {
          //get the number of items shown per page
          var show_per_page = parseInt($("#show_per_page").val());
          //get the element number where to start the slice from
          start_from = page_num * show_per_page;
          //get the element number where to end the slice
          end_on = start_from + show_per_page;
          //hide all children elements of pagingBox div, get specific items and show them
          $("#modalContent")
            .children()
            .css("display", "none")
            .slice(start_from, end_on)
            .css("display", "inline-block");
          /*get the page link that has longdesc attribute of the current page and add active class to it
        and remove that class from previously active page link*/
          $("#" + listWraper + " .page_item[longdesc=" + page_num + "]")
            .addClass("active")
            .siblings(".active")
            .removeClass("active");
          //update the current page input field
          $("#current_page").val(page_num);
        }
        var youtubeNextPageFlag;
        var listIndex = 0;
        function handlePagination(perPageItem, videoCountNumber, listWraper) {
          addPagination(perPageItem, videoCountNumber, listWraper);
          $(document).on("click", "#" + listWraper + " .previous_link",
            function (e) {
              new_page = parseInt($("#current_page").val()) - 1;
              //if there is an item before the current active link run the function
              // if ($(".active").prev("#" + listWraper + " .page_item").length == true) {
              go_to_page(new_page, listWraper);
              listIndex = new_page + 1;
              console.log(listIndex)
              if (listIndex == 1) {
                $(this).css("display", "none");
              }
              if (listIndex >= 1) {
                $("#"+listWraper + " .next_link").css("display", "block");
              }
              if (listIndex == 0) {
                $("#"+listWraper + " .previous_link").css("display", "none");
                e.preventDefault();
                return false;
              }
              if (listWraper == "page_navigation") {
                if ($("#input-playlist").val() == "") {
                  getPlaylistData(kalturaPageLength, listIndex, "");
                }
                if ($("#input-playlist").val() != "") {
                  var searchText = $("#input-playlist").val();
                  getPlaylistData(kalturaPageLength, listIndex, searchText);
                }
              }
              if (listWraper == "youtube_navigation") {
                youtubeNextPageFlag ? (youtubePrevFlag = true) : "";
                if ($("#youtubeSearchInput").val() != "") {
                  handleYoutubePlaylist(
                    youtubePrevPageToken,
                    $("#youtubeSearchInput").val()
                  );
                } else {
                  handleYoutubePlaylist(youtubePrevPageToken);
                }
              }
              if (listWraper == "vimeo_navigation") {
                handleVimeoPlaylist(vimeoPrevPage);
              }
              // }
            }
          );

          $(document).on("click", "#" + listWraper + " .page_item", function () {
            var pageNumber = $(this).attr("longdesc");
            listIndex = $(this).text();
            go_to_page(pageNumber, listWraper);
            if (listWraper == "page_navigation") {
              if ($("#input-playlist").val() == "") {
                getPlaylistData(kalturaPageLength, listIndex, "");
              }
              if ($("#input-playlist").val() != "") {
                var searchText = $("#input-playlist").val();
                getPlaylistData(kalturaPageLength, listIndex, searchText);
              }
            }
            if (listWraper == "youtube_navigation") {
              youtubeNextPageFlag = true;
              handleYoutubePlaylist();
            }
          });

          $(document).on("click", "#" + listWraper + " .next_link", function () {
            if (listIndex == 0) {
              $("#"+listWraper + " .previous_link").css("display", "block");
            }
            new_page = parseInt($("#current_page").val()) + 1;
            //if there is an item after the current active link run the function
            // if ($(".active").next("#" + listWraper + " .page_item").length == true) {
            go_to_page(new_page, listWraper);
            listIndex = new_page + 1;
            var getTotalListCount = totalVideoCount/kalturaPageLength;
            var getEjectTotal = Math.ceil(getTotalListCount);
            if (getEjectTotal == listIndex) {
              $(this).css("display", "none");
              // return false;
            }
            if (listIndex >=2) {
              $("#"+listWraper + " .previous_link").css("display", "block");
            }
            if (listWraper == "page_navigation") {
              if ($("#input-playlist").val() == "") {
                getPlaylistData(kalturaPageLength, listIndex, "");
              }
              if ($("#input-playlist").val() != "") {
                var searchText = $("#input-playlist").val();
                getPlaylistData(kalturaPageLength, listIndex, searchText);
              }
            }
            if (listWraper == "youtube_navigation") {
              youtubeNextPageFlag = true;
              if ($("#youtubeSearchInput").val() != "") {
                handleYoutubePlaylist(
                  youtubeNextPageToken,
                  $("#youtubeSearchInput").val()
                );
              } else {
                handleYoutubePlaylist(youtubeNextPageToken);
              }
            }
            if (listWraper == "vimeo_navigation") {
              handleVimeoPlaylist(vimeoNextPage);
            }
            // }
          });
        }        
        getPlaylistData(kalturaPageLength, listIndex, "");
        setTimeout(function () {
          handlePagination(kalturaPageLength, totalVideoCount, "page_navigation");
        }, 3000);
        $(document).on("keyup", "#input-playlist", function () {
          var searchText = $(this).val();
          getPlaylistData(kalturaPageLength, listIndex, searchText);
          setTimeout(function () {
            handlePagination(kalturaPageLength, totalVideoCount, "page_navigation");
          }, 3000);
        });
        
        $(document).on("click", "#lti-tool-settings", function () {
          getLTIToolSettingsList();
        });

        $(document).on("change", "#ltiToolSettingsSelect", function () {
          if ($(this).val() != '' && $(this).val() > 0) {            
            getLTIToolSearchForm($(this).val());
          } else {
            $('#loaderDiv').attr('class', '');
            $('#lti-tool-settings-content').html('');
          }
        });       

        async function getLTIToolSettingsList() {
          $('#loaderDiv').attr('class', 'loader');
          $.ajax({
            type: "GET",
            dataType: "json",
            url: LTIToolSettings.apiPath.getLTIToolList,
            success: function (data) {
              if (Object.keys(data.data.lti_tool_settings).length > 0) {
                $('#loaderDiv').attr('class', '');
                $('#ltiToolSettingsSelect').val("");
                $('#ltiToolSettingsSelect').text("");
                $('#ltiToolSettingsSelect')
                .append($("<option></option>")
                    .attr("value",0)
                    .text("Please Select LTI Tool")); 
                $.each(data.data.lti_tool_settings, function(key, value) {
                   $('#ltiToolSettingsSelect')
                   .append($("<option></option>")
                    .attr("value",key)                    
                    .text(value)); 
                });
              }else{
                $('#ltiToolSettingsSelect').val("");
                $('#ltiToolSettingsSelect').text("");
                $('#ltiToolSettingsSelect')
                .append($("<option></option>")
                    .attr("value","")
                    .text("No LTI Tool Found")); 
              }
            },
          });
        }

        async function getLTIToolSearchForm(id) {
          $('#loaderDiv').attr('class', 'loader');
          $.ajax({
            type: "GET",
            dataType: "json",
            data:{
              id: id
            },
            url: LTIToolSettings.apiPath.getLTIToolSearch,
            success: function (data) {              
              var html = '<iframe name="iframeContent" id="iframeContent" width="100%" height="1000px" frameBorder="0"></iframe><form id="ltiLaunchForm" name="ltiLaunchForm" method="POST" action="'+data.launchUrl+'" target="iframeContent">';
                        $.each(data.results, function(key, value) {
                           html += '<input type="hidden" name="'+key+'" value="'+value+'">';
                        });     
                        html +='</form>';
                        $('#lti-tool-settings-content').html(html);
                        $('#ltiLaunchForm').trigger('submit');
                  $('#loaderDiv').attr('class', '');      
              
              // $.ajax({
              //   type: "POST",
              //   data: data.results,
              //   url: data.launchUrl,
              //   success: function (data) {
              //     $('#loaderDiv').attr('class', '');
              //     $('#lti-tool-settings-content').html(data);
              //   }
              // });
            },
          });
        }

        $(document).on("click", "#kaltura", function () {
          getPlaylistData(kalturaPageLength, listIndex, "");
          setTimeout(function () {
            $(".kaltura-pagination").html("");
            handlePagination(kalturaPageLength, totalVideoCount, "page_navigation");
          }, 3000);
          $(document).on("keyup", "#input-playlist", function () {
            var searchText = $(this).val();
            getPlaylistData(kalturaPageLength, listIndex, searchText);
            setTimeout(function () {
              handlePagination(kalturaPageLength, totalVideoCount, "page_navigation");
            }, 3000);
          });
        });

        function createYoutubeHTML(items) {
          $("#youtubePlaylistWraper").html("");
          items.forEach(function (item, key) {
            var youtubeNode =
              '<div class="play-item" data-filter-item data-filter-name="' +
              item.snippet.title.toLowerCase() +
              '">' +
              '<img class="youtube-play-list-thumbnail" src="' +
              item.snippet.thumbnails.medium.url +
              '" width=' +
              item.snippet.thumbnails.medium.width +
              " height=" +
              item.snippet.thumbnails.medium.height +
              ' data-url="' +
              item.id.videoId +
              '">' +
              '<span class="kaltura-video-title">' +
              item.snippet.title +
              "</span>" +
              "</div>";
            $("#youtubePlaylistWraper").append(youtubeNode);
          });
        }
        var youtubeNextPageToken, youtubePrevPageToken, youtubeVideoCount;
        function getYoutubePlaylist(url) {
          $.ajax({
            type: "GET",
            dataType: "jsonp",
            url: url,
            success: function (data) {
              youtubeVideoCount = data.pageInfo.totalResults;
              createYoutubeHTML(data.items);
              youtubeNextPageToken = data.nextPageToken;
              youtubePrevPageToken = data.prevPageToken;
            },
          });
        }

        function handleYoutubePlaylist(pageToken, searchText) {
          if (searchText == undefined) {
            searchText = "";
          }
          if (pageToken) {
            var youtubePlaylistUrl =
              `https://www.googleapis.com/youtube/v3/search?` +
              `order=${YoutubeConfig.order}&part=${YoutubeConfig.part}&channelId=` +
              `${YoutubeConfig.channelId}&pageToken=${pageToken}&q=${searchText}&key=${YoutubeConfig.key}`;
          } else {
            var youtubePlaylistUrl =
              `https://www.googleapis.com/youtube/v3/search?` +
              `order=${YoutubeConfig.order}&part=${YoutubeConfig.part}&channelId=` +
              `${YoutubeConfig.channelId}&q=${searchText}&key=${YoutubeConfig.key}`;
          }
          getYoutubePlaylist(youtubePlaylistUrl);
        }

        $(document).on("click", "#youtube", function () {
          var youtubePromise = new Promise(function (resolve, reject) {
            handleYoutubePlaylist();
            setTimeout(function () {
              youtubeVideoCount ? resolve() : "";
            }, 3000);
          });
          youtubePromise.then(function () {
            $(".pagination").html("");
            handlePagination(5, youtubeVideoCount, "youtube_navigation");
          });
        });

        $(document).on("keyup", "#youtubeSearchInput", function () {
          var searchText = $(this).val();
          handleYoutubePlaylist("", searchText);
        });

        $(document).on("click", ".youtube-play-list-thumbnail", function () {
          var youtubeVideId = $(this).data("url");
          var youtubeVideoUrl = `https://www.youtube.com/watch?v=${youtubeVideId}`;
          $(".h5p-file-url").val(youtubeVideoUrl);
          $(".modal").css("display", "none");
        });

        $(document).on("click", "#vimeo", function () {
          var vimeoPromise = new Promise(function (resolve, reject) {
            handleVimeoPlaylist();
            setTimeout(function () {
              vimeoVideoCount ? resolve() : "";
            }, 3000);
          });
          vimeoPromise.then(function () {
            $(".pagination").html("");
            handlePagination(
              VimeoConfig.perPage,
              vimeoVideoCount,
              "vimeo_navigation"
            );
          });
        });

        function handleVimeoPlaylist(pageURL, searchText) {
          if (pageURL === undefined || searchText === "") {
            pageURL = `/channels/${VimeoConfig.channelId}/videos?per_page=${VimeoConfig.perPage}&page=1`;
          }
          if (pageURL === "" && searchText) {
            pageURL = `/channels/${VimeoConfig.channelId}/videos?per_page=${VimeoConfig.perPage}&query=${searchText}`;
          }
          if (pageURL === null) {
            return false;
          }
          getVimeoPlaylist(pageURL);
        }

        var vimeoVideoCount, vimeoPrevPage, vimeoNextPage;
        function getVimeoPlaylist(pageURL) {
          vimeoUrl = `https://api.vimeo.com${pageURL}`;
          $.ajax({
            type: "GET",
            url: vimeoUrl,
            dataType: "json",
            headers: {
              Authorization: "Bearer " + VimeoConfig.bearerToken,
            },
            success: function (data) {
              console.log(data);
              vimeoVideoCount = data.total;
              vimeoPrevPage = data.paging.previous;
              vimeoNextPage = data.paging.next;
              generateVimeoPlaylistHTML(data.data);
            },
          });
        }

        function generateVimeoPlaylistHTML(items) {
          $("#vimeoPlaylistWraper").html("");
          items.forEach(function (item, key) {
            var vimeoNode =
              '<div class="play-item" data-filter-item data-filter-name="' +
              item.name.toLowerCase() +
              '">' +
              '<img class="vimeo-play-list-thumbnail" src="' +
              item.pictures.sizes[0].link +
              '" width=' +
              item.pictures.sizes[0].width +
              " height=" +
              item.pictures.sizes[0].height +
              ' data-url="' +
              item.uri +
              '">' +
              '<span class="kaltura-video-title">' +
              item.name +
              "</span>" +
              "</div>";
            $("#vimeoPlaylistWraper").append(vimeoNode);
          });
        }

        $(document).on("keyup", "#vimeoSearchInput", function () {
          var searchText = $(this).val();
          handleVimeoPlaylist("", searchText);
        });

        $(document).on("click", ".vimeo-play-list-thumbnail", function () {
          var vimeoVideId = $(this).data("url");
          var vimeoVideoUrl = `https://player.vimeo.com${vimeoVideId}`;
          $(".h5p-file-url").val(vimeoVideoUrl);
          $(".modal").css("display", "none");
        });
      });
    }, 2000);
  })(H5P.jQuery);
}