# Searching issues and pull requests

You can search for issues and pull requests on GitHub and narrow the results using these search qualifiers in any combination.

You can search for issues and pull requests globally across all of GitHub, or search for issues and pull requests within a particular organization. For more information, see [About searching on GitHub](/en/search-github/getting-started-with-searching-on-github/about-searching-on-github).

> \[!TIP]
>
> * This article contains example searches on GitHub.com, but you can use the same search filters on other GitHub platforms.
> * You can build advanced filters using boolean and nested queries on your repository's issues page and the issues dashboard. See [Filtering and searching issues and pull requests](/en/issues/tracking-your-work-with-issues/using-issues/filtering-and-searching-issues-and-pull-requests#building-advanced-filters-for-issues).
> * For a list of search syntaxes that you can add to any search qualifier to further improve your results, see [Understanding the search syntax](/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax).
> * Use quotations around multi-word search terms. For example, if you want to search for issues with the label "In progress," you'd search for `label:"in progress"`. Search is not case sensitive.
> * Use a minus (hyphen) symbol to exclude results that match a qualifier. For example, to ignore issues created by the "octocat" user, you'd use `-author:octocat` in your search. Note that this does not work for [missing metadata qualifiers](#search-by-missing-metadata).
> * You can focus your cursor on the search bar above the issue or pull request list with a keyboard shortcut. For more information, see [Keyboard shortcuts](/en/get-started/accessibility/keyboard-shortcuts#issue-and-pull-request-lists).

## Search only issues or pull requests

By default, GitHub search will return both issues and pull requests. However, you can restrict search results to just issues or pull requests using the `type` or `is` qualifier.

| Qualifier    | Example                                                                                                                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type:pr`    | [**cat type:pr**](https://github.com/search?q=cat+type%3Apr\&type=Issues) matches pull requests with the word "cat."                                                                                       |
| `type:issue` | [**github commenter:defunkt type:issue**](https://github.com/search?q=github+commenter%3Adefunkt+type%3Aissue\&type=Issues) matches issues that contain the word "github," and have a comment by @defunkt. |
| `is:pr`      | [**event is:pr**](https://github.com/search?utf8=%E2%9C%93\&q=event+is%3Apr\&type=) matches pull requests with the word "event."                                                                           |
| `is:issue`   | [**is:issue label:bug is:closed**](https://github.com/search?utf8=%E2%9C%93\&q=is%3Aissue+label%3Abug+is%3Aclosed\&type=) matches closed issues with the label "bug."                                      |

## Search by the title, body, or comments

With the `in` qualifier you can restrict your search to the title, body, comments, or any combination of these. When you omit this qualifier, the title, body, and comments are all searched.

| Qualifier     | Example                                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `in:title`    | [**warning in:title**](https://github.com/search?q=warning+in%3Atitle\&type=Issues) matches issues with "warning" in their title.               |
| `in:body`     | [**error in:title,body**](https://github.com/search?q=error+in%3Atitle%2Cbody\&type=Issues) matches issues with "error" in their title or body. |
| `in:comments` | [**shipit in:comments**](https://github.com/search?q=shipit+in%3Acomment\&type=Issues) matches issues mentioning "shipit" in their comments.    |

## Search within a user's or organization's repositories

To search issues and pull requests in all repositories owned by a certain user or organization, you can use the `user` or `org` qualifier. To search issues and pull requests in a specific repository, you can use the `repo` qualifier.

If you have access to pull requests in more than 10,000 repositories, you will need to limit your search to a specific organization, personal account, or repository to see results.

| Qualifier                                      | Example                                                                                                                                                                                                                       |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <code>user:<em>USERNAME</em></code>            | [**user:defunkt ubuntu**](https://github.com/search?q=user%3Adefunkt+ubuntu\&type=Issues) matches issues with the word "ubuntu" from repositories owned by @defunkt.                                                          |
| <code>org:<em>ORGNAME</em></code>              | [**org:github**](https://github.com/search?q=org%3Agithub\&type=Issues\&utf8=%E2%9C%93) matches issues in repositories owned by the GitHub organization.                                                                      |
| <code>repo:<em>USERNAME/REPOSITORY</em></code> | [**repo:mozilla/shumway created:<2012-03-01**](https://github.com/search?q=repo%3Amozilla%2Fshumway+created%3A%3C2012-03-01\&type=Issues) matches issues from @mozilla's shumway project that were created before March 2012. |

## Search by open or closed state

You can filter issues and pull requests based on whether they're open or closed using the `state` or `is` qualifier.

| Qualifier      | Example                                                                                                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `state:open`   | [**libraries state:open mentions:vmg**](https://github.com/search?utf8=%E2%9C%93\&q=libraries+state%3Aopen+mentions%3Avmg\&type=Issues) matches open issues that mention @vmg with the word "libraries." |
| `state:closed` | [**design state:closed in:body**](https://github.com/search?utf8=%E2%9C%93\&q=design+state%3Aclosed+in%3Abody\&type=Issues) matches closed issues with the word "design" in the body.                    |
| `is:open`      | [**performance is:open is:issue**](https://github.com/search?q=performance+is%3Aopen+is%3Aissue\&type=Issues) matches open issues with the word "performance."                                           |
| `is:closed`    | [**android is:closed**](https://github.com/search?utf8=%E2%9C%93\&q=android+is%3Aclosed\&type=) matches closed issues and pull requests with the word "android."                                         |

## Search for pull requests in the merge queue

You can also use the `is` qualifier to find pull requests that are queued to merge.

| Qualifier   | Example                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `is:queued` | [**is:queued**](https://github.com/search?q=is%3Aqueued\&type=pullrequests) matches pull requests that are currently queued to merge. |

## Search by the reason an issue was closed

You can filter issues based on the reason given when the issue was closed, using the `reason` qualifier.

| Qualifier              | Example                                                                                                                                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reason:completed`     | [**libraries is:closed reason:completed**](https://github.com/search?q=libraries+is%3Aclosed+reason%3Acompleted\&type=Issues) matches issues with the word "libraries" that were closed as "completed."               |
| `reason:"not planned"` | [**libraries is:closed reason:"not planned"**](https://github.com/search?q=libraries+is%3Aclosed+reason%3A%22not+planned%22\&type=Issues) matches issues with the word "libraries" that were closed as "not planned." |

## Filter by repository visibility

You can filter by the visibility of the repository containing the issues and pull requests using the `is` qualifier. For more information, see [About repositories](/en/repositories/creating-and-managing-repositories/about-repositories#about-repository-visibility).

| Qualifier    | Example                                                                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `is:public`  | [**is:public**](https://github.com/search?q=is%3Apublic\&type=Issues) matches issues and pull requests in public repositories.                                                                   |
|              |                                                                                                                                                                                                  |
| `is:private` | [**is:private cupcake**](https://github.com/search?q=is%3Aprivate+cupcake\&type=Issues) matches issues and pull requests that contain the word "cupcake" in private repositories you can access. |

## Search by author

The `author` qualifier finds issues and pull requests created by a certain user or integration account.

| Qualifier                                               | Example                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <code>author:<em>USERNAME</em></code>                   | [**cool author:gjtorikian**](https://github.com/search?q=cool+author%3Agjtorikian\&type=Issues) matches issues and pull requests with the word "cool" that were created by @gjtorikian.                                                                                                                             |
| `in:body` <code>author:<em>USERNAME</em></code>         | [**bootstrap in:body author:mdo**](https://github.com/search?q=bootstrap+in%3Abody+author%3Amdo\&type=Issues) matches issues written by @mdo that contain the word "bootstrap" in the body.                                                                                                                         |
| <code>author:app/<em>USERNAME</em></code>               | [**author:app/robot**](https://github.com/search?q=author%3Aapp%2Frobot\&type=Issues) matches issues created by the integration account named "robot."                                                                                                                                                              |
| <code>-</code><code>author:app/<em>USERNAME</em></code> | [**-author:app/robot**](https://github.com/search?q=-author%3Aapp%2Frobot\&type=Issues) matches issues created by any user other than the integration account named "robot." The minus sign, or dash character (<code>-</code>) before the qualifier signifies a logical NOT for the qualifier in the search query. |

## Search by assignee

The `assignee` qualifier finds issues and pull requests that are assigned to a certain user. You can search for issues and pull requests that have *any* assignee by using the wildcard character `*`, but only within a single repository. You can also search for [issues and pull requests that have no assignee](#search-by-missing-metadata).

| Qualifier                               | Example                                                                                                                                                                                                                            |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <code>assignee:<em>USERNAME</em></code> | [**assignee:vmg repo:libgit2/libgit2**](https://github.com/search?utf8=%E2%9C%93\&q=assignee%3Avmg+repo%3Alibgit2%2Flibgit2\&type=Issues) matches issues and pull requests in libgit2's project libgit2 that are assigned to @vmg. |
| <code>assignee:\*</code>                | [**is:open is:issue assignee:\***](https://github.com/openssl/openssl/issues/assigned/*) matches open issues within a single repository that are assigned to any user.                                                             |

## Search by mention

The `mentions` qualifier finds issues that mention a certain user. For more information, see [Basic writing and formatting syntax](/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#mentioning-people-and-teams).

| Qualifier                               | Example                                                                                                                                                          |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <code>mentions:<em>USERNAME</em></code> | [**`resque mentions:defunkt`**](https://github.com/search?q=resque+mentions%3Adefunkt\&type=Issues) matches issues with the word "resque" that mention @defunkt. |

## Search by team mention

For organizations and teams you belong to, you can use the `team` qualifier to find issues or pull requests that @mention a certain team within that organization. Replace these sample names with your organization and team name to perform a search.

| Qualifier                                                   | Example                                                                                               |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| <code>team:<em>ORGNAME/TEAMNAME</em></code>                 | **`team:jekyll/owners`** matches issues where the `@jekyll/owners` team is mentioned.                 |
| <code>team:<em>ORGNAME/TEAMNAME</em></code> `is:open is:pr` | **team:myorg/ops is:open is:pr** matches open pull requests where the `@myorg/ops` team is mentioned. |

## Search by commenter

The `commenter` qualifier finds issues that contain a comment from a certain user.

| Qualifier                                | Example                                                                                                                                                                                                                                                     |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <code>commenter:<em>USERNAME</em></code> | [**github commenter:defunkt org:github**](https://github.com/search?utf8=%E2%9C%93\&q=github+commenter%3Adefunkt+org%3Agithub\&type=Issues) matches issues in repositories owned by GitHub, that contain the word "github," and have a comment by @defunkt. |

## Search by a user that's involved in an issue or pull request

You can use the `involves` qualifier to find issues that in some way involve a certain user. The `involves` qualifier is a logical OR between the `author`, `assignee`, `mentions`, and `commenter` qualifiers for a single user. In other words, this qualifier finds issues and pull requests that were either created by a certain user, assigned to that user, mention that user, or were commented on by that user.

| Qualifier                                         | Example                                                                                                                                                                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <code>involves:<em>USERNAME</em></code>           | **[involves:defunkt involves:jlord](https://github.com/search?q=involves%3Adefunkt+involves%3Ajlord\&type=Issues)** matches issues either @defunkt or @jlord are involved in.                                      |
| `in:body` <code>involves:<em>USERNAME</em></code> | [**NOT bootstrap in:body involves:mdo**](https://github.com/search?q=NOT+bootstrap+in%3Abody+involves%3Amdo\&type=Issues) matches issues @mdo is involved in that do not contain the word "bootstrap" in the body. |

## Search for my issues and pull requests

You can search for issues and pull requests you have created or have interacted with by following the desired qualifier with `@me`. Any qualifier that works with a username allows you to limit your search to issues and pull requests you created, are assigned, mentioned on, or are requested as a reviewer of.

| Qualifier                                 | Example                                                                                                                                          |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| <code>author:<em>@me</em></code>          | **[author:@me](https://github.com/search?q=author%3A%40me)** matches issues and pull requests yo