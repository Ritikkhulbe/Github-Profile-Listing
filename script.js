function getUserDetails(user) {
    var userURL = 'https://api.github.com/users/' + user;
    $.get(userURL, function (userData) {
        console.log(userData);

        //profile
        $("#user-box").append(`
            <div class="profile-container">
                <div class="left-section">
                    <div class="control">
                        <a href="index.html"><button class="back"> < </button></a>
                    </div>
                    <div class = "profile-link">
                        <img src="${userData.avatar_url}" alt="Profile Picture" class="profile-picture">
                        <a href="https://github.com/${user}" class="profile-url">
                            <div><img src="assets/icons/icons8-link-24.png" height="20px"></div>
                            <div>&nbsp View on Github</div>
                        </a>
                    </div>
                </div>
                <div class="profile-info">
                    <div class="extra"></div>
                    <h1>${userData.name}</h1>
                    <p>${userData.bio}</p>
                    <div class="location">
                        <div>
                            <img src="assets/icons/icons8-location-64.png" height="20px">
                        </div>
                    <div>${userData.location}</div>
                </div>
                    <div class="follow">
                        <span>Followers : ${userData.followers}</span>
                        <span> Following : ${userData.following}</span>
                    </div>
                </div>
            </div>
        `)
        genRepo(user);
    }).fail(function (error) {

        //user not found
        console.log(error.status);
        $("#mainArea").append(`
            <div id="back">
                <a href="index.html">Go Back</a>
            </div>
            <div class='error-box'>
                <h1 class='error-msg'> 
                    Sorry, there was an error fetching user details 
                </h1>
            </div>
        `);
    });
}

function genRepo(user) {

        var requestURL = 'https://api.github.com/users/' + user +'/repos';
        var request = $.get(requestURL, () => {
        }).done(function () {
            request = request.responseJSON;
            if (request.status === 404) {
                console.log("user not found")
                $("#repo-box").append(`
                <div class='error-box'>
                    <h1 class='error-msg'> 
                        Error loading User Repositories.
                    </h1>
                </div>`);
            }
            else {
                console.log(request);
                //initializing variables
                let currentPage = 1;
                let view = 10;
                var totalPages = Math.ceil(request.length / view);

                //dropdown 
                $("#view-box").append(`
                    <div class="view">
                    <div class="custom-dropdown">
                    <select id="viewDropdown">
                    <option value="2">2</option>
                    <option value="6">6</option>
                    <option value="10" selected>10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    </select>
                    </div>
                    </div>
                `)


                function createRepo(){
                    let start =(currentPage-1)*view;

                    //loops with page and amount of repos to view
                    for (i = Number(start); i < Math.min(Number(start)+Number(view), request.length); i++) {
                        // variables from api request
                        var repo_url = request[i].html_url;
                        var repo_name = request[i].name;
                        var repo_description = request[i].description;
                        var repo_language = request[i].language;
                        var repo_stars = request[i].stargazers_count;
                        var repo_forks = request[i].forks;

                        // replaces null values to be better represented when displayed
                        if (repo_description == null) {
                            repo_description = "<i>No Description</i>";
                        }
                        if (repo_language == null) {
                            repo_language = "-";
                        }

                        // Puts repo information into div
                        $("#repo-box").append(`<a href='${repo_url}' target='_blank'>
                            <div class='repo-item'>
                                <div class='repo-name'>
                                    ${repo_name}
                                </div>
                                <p class='description'>
                                    ${repo_description}
                                </p>
                                <div class='bottom'>
                                    <div><img src="assets/icons/icons8-code-50.png" height="15px"></div>
                                    <div class='language'>
                                        ${repo_language}
                                    </div>  
                                    <div><img src="assets/icons/icons8-star-50.png" height="15px"></div>
                                    <div class='star'>
                                        ${repo_stars}  
                                    </div> 
                                    <div><img src="assets/icons/icons8-code-fork-32.png" height="15px"></div>
                                    <div class='fork'>
                                        ${repo_forks}
                                    </div>
                                </div>
                            </div>
                        `);
                    }
                }
                                
                
                
                
                function createFoot(){
                    $("#footer").append(`
                    <div class="pagination" id="pagination">
                    </div>
                    `)
                }
                // Initial setup
                createRepo();
                createFoot();
                // Event listener for the previous button
                
            
            
            // Function to update the pagination buttons
            function updatePagination() {
                totalPages = Math.ceil(request.length / view);
                console.log(currentPage);
                $("#pagination").empty();

                // Previous button
                if (currentPage > 1) {
                $("#pagination").append('<span class="nav-btn" id="prev"> << </span>');
                } else {
                $("#pagination").append('<span class="nav-btn disabled"> << </span>');
                }

                // Page numbers
                for (var i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
                    if (i === currentPage) {
                        $("#pagination").append('<span class="page-number active">' + i + '</span>');
                    } else {
                        $("#pagination").append('<span class="page-number">' + i + '</span>');
                    }
                }

                // Next button
                if (currentPage < totalPages) {
                $("#pagination").append('<span class="nav-btn" id="next"> >> </span>');
                } else {
                $("#pagination").append('<span class="nav-btn disabled"> >> </span>');
                }
            }

            // Initial setup
            updatePagination();

            //When drop down value changes
            $("#viewDropdown").on("change", function() {
                // Update the 'view' variable with the selected value
                view = $(this).val();
                totalPages = Math.ceil(request.length / view);
                currentPage=1;
                updatePagination();
                $("#repo-box").empty();
                createRepo();
            });

            // Click event for page numbers
            $(document).on("click", ".page-number", function() {
                currentPage = parseInt($(this).text());
                updatePagination();
                $("#repo-box").empty();
                createRepo()
            });

            // Click event for previous button
            $(document).on("click", "#prev", function() {
                if (currentPage > 1) {
                currentPage--;
                updatePagination();
                $("#repo-box").empty();
                createRepo()
                }
            });

            // Click event for next button
            $(document).on("click", "#next", function() {
                if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
                $("#repo-box").empty();
                createRepo()
                }
            });
        }
    }
    )
}
