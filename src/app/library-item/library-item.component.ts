import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";
import { ActivatedRoute, Router } from "@angular/router";
import { WordpressService } from "../services/wordpress.service";

@Component({
  selector: "app-library-item",
  templateUrl: "./library-item.component.html",
  styleUrls: ["./library-item.component.css"],
})
export class LibraryItemComponent implements OnInit {
  libraries = [];
  topicParam = "";
  itemParam = "";
  itemPost: any;
  favorited = false;
  spinner = false;
  spinnerDesktop = false;

  constructor(
    private data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private wp: WordpressService
  ) {}

  ngOnInit() {
    this.loadLibraryItemData();
    this.loadFavoriteStatus();
  }

  loadLibraryItemData() {
    this.data.currentLibraryData.subscribe((data: any) => {
      this.libraries = data.category_info;
    });
    this.route.queryParamMap.subscribe((params) => {
      this.topicParam = params.get("topic");
      this.itemParam = params.get("item");
      if (this.topicParam !== null && this.itemParam !== null) {
        this.libraries.forEach((library: any) => {
          if (library.cat_slug === this.topicParam) {
            library.cat_posts.forEach((post: any) => {
              if (post.post_id === +this.itemParam) {
                this.itemPost = post;
              }
            });
          }
        });
      }
    });
  }

  loadFavoriteStatus() {
    const Favorites = JSON.parse(localStorage.getItem("Favorites"));
    if (Favorites !== null) {
      if (Favorites.includes(this.itemParam)) {
        this.favorited = true;
      }
    }
  }

  onClickBack() {
    this.router.navigate(["/"], {
      queryParams: { module: "library" },
    });
  }

  onClickFavorite() {
    this.spinner = true;
    this.spinnerDesktop = true;
    let LessonArray = JSON.parse(localStorage.getItem("Lesson"));
    let IndexArray = JSON.parse(localStorage.getItem("Index"));
    const Favorites = JSON.parse(localStorage.getItem("Favorites"));
    let favoriteStatus = false;

    if (LessonArray === null && IndexArray === null) {
      IndexArray = [];
      LessonArray = [];
    }

    if (!Favorites.includes(this.itemParam)) {
      Favorites.push(this.itemParam);
      favoriteStatus = true;
    } else {
      const index = Favorites.indexOf(this.itemParam);
      if (index > -1) {
        Favorites.splice(index, 1);
      }
      favoriteStatus = false;
    }

    const UserId = localStorage.getItem("UserID");
    if (UserId !== null) {
      this.wp
        .saveData({
          userId: UserId,
          indexArray: IndexArray,
          lessonArray: LessonArray,
          favorites: Favorites,
        })
        .subscribe(
          (res: any) => {
            const value = JSON.parse(res);
            if (value.success === true) {
              console.log("saved");
              this.spinner = false;
              this.spinnerDesktop = false;
              if (favoriteStatus) {
                this.favorited = true;
              } else {
                this.favorited = false;
              }
              localStorage.setItem("Favorites", JSON.stringify(Favorites));
            } else {
              console.log("not saved");
            }
          },
          (err: any) => {
            console.log("add", err);
          }
        );
    } else {
      console.log("userID not found");
    }
  }
}
