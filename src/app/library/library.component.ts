import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";
import { Router } from "@angular/router";
import { WordpressService } from "../services/wordpress.service";

@Component({
  selector: "app-library",
  templateUrl: "./library.component.html",
  styleUrls: ["./library.component.css"],
})
export class LibraryComponent implements OnInit {
  categories = [];
  recentPosts = [];
  searchQuery = "";
  menuOpened = false;

  constructor(
    private data: DataService,
    private router: Router,
    private wp: WordpressService
  ) {}

  ngOnInit() {
    this.loadLibraryData();
    this.saveFavoritesData();
  }

  loadLibraryData() {
    this.data.currentLibraryData.subscribe((data: any) => {
      this.categories = data.category_info;
      this.recentPosts = data.recent_posts;
    });
  }

  onClickLibraryItem(category: any) {
    this.router.navigate(["/"], {
      queryParams: { module: "library", topic: category.cat_slug },
    });
  }

  getPostDate(date: string) {
    let formattedDate = "";
    const splitDateAndTime = date.split(" ");
    const splitDate = splitDateAndTime[0].split("-");
    formattedDate = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
    return formattedDate;
  }

  toggleSidebar() {
    this.menuOpened = !this.menuOpened;
  }

  onSearch(query: string) {
    if (query !== "") {
      this.router.navigate(["/"], {
        queryParams: { module: "library", search: query },
      });
    }
  }

  onClickRecentPost(post: any) {
    const topicName = this.getTopicName(post.ID);
    this.router.navigate(["/"], {
      queryParams: {
        module: "library",
        topic: topicName,
        item: post.ID,
      },
    });
  }

  getTopicName(postID: number) {
    let tempCatName = "";
    this.categories.forEach((category: any) => {
      category.cat_posts.forEach((post: any) => {
        if (post.post_id === postID) {
          tempCatName = category.cat_slug;
        }
      });
    });
    return tempCatName;
  }

  onCLickFavorite() {
    this.router.navigate(["/"], {
      queryParams: { module: "library", preference: "favorites" },
    });
  }

  saveFavoritesData() {
    const tempFavorites = localStorage.getItem("Favorites");
    const tempIndex = JSON.parse(localStorage.getItem("Index"));
    const tempLesson = JSON.parse(localStorage.getItem("Lesson"));
    const tempUserID = localStorage.getItem("UserID");

    const initialFavorites = [];

    if (tempFavorites === "undefined") {
      if (tempUserID !== null) {
        this.wp
          .saveData({
            userId: tempUserID,
            indexArray: tempIndex,
            lessonArray: tempLesson,
            favorites: initialFavorites,
          })
          .subscribe(
            (res: any) => {
              const successValue = JSON.parse(res);
              if (successValue.success === true) {
                console.log("initial favorite saved");
                localStorage.setItem(
                  "Favorites",
                  JSON.stringify(initialFavorites)
                );
              } else {
                console.log("not saved");
              }
            },
            (err: any) => {
              console.log("add", err);
            }
          );
      }
    }
  }
}
