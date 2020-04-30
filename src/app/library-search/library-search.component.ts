import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DataService } from "../services/data.service";

@Component({
  selector: "app-library-search",
  templateUrl: "./library-search.component.html",
  styleUrls: ["./library-search.component.css"],
})
export class LibrarySearchComponent implements OnInit {
  categories = [];
  categoriesPosts = [];
  filteredTopicArray = [];
  searchParam = "";
  itemSelected = "";

  constructor(
    private router: Router,
    private data: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadLibraryData();
  }

  loadLibraryData() {
    this.route.queryParamMap.subscribe((params) => {
      this.searchParam = params.get("search");
    });
    this.data.currentLibraryData.subscribe((data: any) => {
      this.categories = data.category_info;

      const tempPosts = [];
      this.categories.forEach((category: any) => {
        category.cat_posts.forEach((post: any) => {
          if (!tempPosts.some((item) => item.post_id === post.post_id)) {
            tempPosts.push(post);
          }
        });
      });
      this.categoriesPosts = tempPosts.filter(
        (x: any) =>
          x.post_title.toLowerCase().includes(this.searchParam.toLowerCase()) ||
          x.post_content.toLowerCase().includes(this.searchParam.toLowerCase())
      );
      this.getTopicItems();
    });
  }

  onClickBack() {
    this.router.navigate(["/"], {
      queryParams: { module: "library" },
    });
  }

  onClickPost(post: any) {
    const topicName = this.getTopicName(post.post_id);
    this.router.navigate(["/"], {
      queryParams: {
        module: "library",
        topic: topicName,
        item: post.post_id,
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

  getTopicItems() {
    this.filteredTopicArray = [];
    this.categories.forEach((category: any) => {
      let tempPostCount = 0;
      let tempCatName = "";
      const tempPosts = [];
      category.cat_posts.forEach((post: any) => {
        this.categoriesPosts.forEach((filteredPost: any) => {
          if (post.post_id === filteredPost.post_id) {
            tempPostCount++;
            tempPosts.push(post);
            tempCatName = category.cat_slug;
          }
        });
      });
      this.filteredTopicArray.push({
        module: tempCatName,
        posts: tempPosts,
        count: tempPostCount,
      });
    });
  }

  onClickTopic(topic: any) {
    this.itemSelected = topic.module;
    this.categoriesPosts = topic.posts;
  }
}
