import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TvshowsItem {
  name: string;
  id: number;
  genre:string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: TvshowsItem[] = [
  {id: 1, name: 'Breaking Bad',genre:'Crime'},
  {id: 2, name: 'Game of Thrones',genre:'Fantasy'},
  {id: 3, name: 'Peaky Blinders',genre:'Crime'},
  {id: 4, name: 'Better Call Saul',genre:'Crime'},
  {id: 5, name: 'Big Bang Theory',genre:'Sitcom'},
  {id: 6, name: 'Suits',genre:'Drama'},
  {id: 7, name: 'Dark',genre:'SciFi'},
  {id: 8, name: 'Daredevil',genre:'Superhero'},
  {id: 9, name: 'How I met your mother',genre:'Sitcom'},
  {id: 10, name: 'Friends',genre:'Sitcom'}
];

/**
 * Data source for the Tvshows view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TvshowsDataSource extends DataSource<TvshowsItem> {
  data: TvshowsItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TvshowsItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: TvshowsItem[]): TvshowsItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TvshowsItem[]): TvshowsItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'genre': return compare(a.genre, b.genre, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
