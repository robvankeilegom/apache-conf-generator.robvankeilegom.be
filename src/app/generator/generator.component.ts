import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import ClipboardJS from 'clipboard';

declare const window: any;

@Component( {
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: [ './generator.component.scss' ]
} )
export class GeneratorComponent implements OnInit, AfterViewInit {
  @ViewChild( 'codeEl' ) codeEl: ElementRef;

  public form: FormGroup;
  public hostFile: string;
  public symlink: string;
  public enableConfig: string;
  public autoAppend: boolean = true;
  public redirectHttps: boolean = false;

  constructor ( private formBuilder: FormBuilder ) {}

  public ngOnInit () {
    this.form = this.formBuilder.group( {
      domain: 'example.com',
      symlink: '/var/www/html/',
      root: '/home/user/websites/example.com',
      apache: '/etc/apache2/sites-available/',
    } );

    this.form.valueChanges.subscribe( val => {
      this.updateCode();
      this.updateExtras();
    } );
    this.updateExtras();

    const cbjs = new ClipboardJS( '.clipboard-button' );
  }

  public ngAfterViewInit (): void {
    this.updateCode();
  }

  public updateCode (): void {
    const code = document.createElement( 'code' );
    code.className = 'html';

    let domain = this.form.value.domain;
    if ( this.autoAppend ) {
      domain += '/public';
    }
    let text = `sudo sh -c 'echo "<VirtualHost *:80>
      ServerName ${this.form.value.domain}
      ServerAlias www.${this.form.value.domain}

      ServerAdmin webmaster@localhost
      DocumentRoot ${this.form.value.symlink}${domain}

      ErrorLog \\$\{APACHE_LOG_DIR\}/${this.form.value.domain}-error.log
      CustomLog \\$\{APACHE_LOG_DIR\}/${this.form.value.domain}-access.log combined

      <Directory "${this.form.value.symlink}${domain}">
        Options Indexes FollowSymLinks MultiViews
        Allow from all
        AllowOverride All
        Require all granted
        Options +Indexes
      </Directory>
    `;

    if ( this.redirectHttps ) {
      text += `
      RewriteEngine on
      RewriteCond %{HTTPS} off
      RewriteRule ^(.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301]
      `;
    }

    text += `
    </VirtualHost>" > ${this.form.value.apache}000-${this.form.value.domain}.conf'`;

    const textNode = document.createTextNode( text );

    this.codeEl.nativeElement.innerHTML = '';
    code.appendChild( textNode );
    this.codeEl.nativeElement.appendChild( code );

    window.umami( 'Update Code' );

  }

  public updateExtras (): void {
    this.hostFile = `sudo sh -c 'echo "127.0.0.1  ${this.form.value.domain}" >> /etc/hosts'`;
    this.symlink = `sudo ln -s  ${this.form.value.root} ${this.form.value.symlink}${this.form.value.domain}`;
    this.enableConfig = `sudo a2ensite ${this.form.value.domain}.conf`;
  }

  public checked ( value, target: 'autoAppend' | 'redirectHttps' ): void {
    if ( target === 'autoAppend' ) {
      this.autoAppend = value.target.checked;
    } else if ( target === 'redirectHttps' ) {
      this.redirectHttps = value.target.checked;
    }
    this.updateCode();
  }
}
