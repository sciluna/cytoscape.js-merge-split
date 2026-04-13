(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.cytoscapeMergeSplit = factory());
})(this, (function () { 'use strict';

  let helper = {};

  /**
   * multiply an array with centering matrix
   * array and result are 1d arrays
   */
  helper.multGamma = function(array){
    let result = [];
    let sum = 0;

    for(let i = 0; i < array.length; i++){
      sum += array[i];
    }

    sum *= (-1)/array.length;

    for(let i = 0; i < array.length; i++){
      result[i] = sum + array[i];
    }     
    return result;
  };

  /**
   * matrix multiplication
   * array1, array2 and result are 2d arrays
   */
  helper.multMat = function(array1, array2){
    let result = [];

    for(let i = 0; i < array1.length; i++){
        result[i] = [];
        for(let j = 0; j < array2[0].length; j++){
          result[i][j] = 0;
          for(let k = 0; k < array1[0].length; k++){
            result[i][j] += array1[i][k] * array2[k][j]; 
          }
        }
      } 
    return result;
  };

  /**
   * matrix transpose
   * array and result are 2d arrays
   */
  helper.transpose = function(array){
    let result = [];
    
    for(let i = 0; i < array[0].length; i++){
      result[i] = [];
      for(let j = 0; j < array.length; j++){
        result[i][j] = array[j][i];
      }
    }
    
    return result;
  };

  /**
   * dot product of two arrays with same size
   * array1 and array2 are 1d arrays
   */
  helper.dotProduct = function(array1, array2){
    let product = 0;

    for(let i = 0; i < array1.length; i++){
      product += array1[i] * array2[i]; 
    }

    return product;
  };

  // Singular Value Decomposition implementation
  function SVD() {
  }
  /* Below singular value decomposition (svd) code including hypot function is adopted from https://github.com/dragonfly-ai/JamaJS
     Some changes are applied to make the code compatible with the fcose code and to make it independent from Jama.
     Input matrix is changed to a 2D array instead of Jama matrix. Matrix dimensions are taken according to 2D array instead of using Jama functions.
     An object that includes singular value components is created for return. 
     The types of input parameters of the hypot function are removed. 
     let is used instead of var for the variable initialization.
  */
  /*
                                 Apache License
                             Version 2.0, January 2004
                          http://www.apache.org/licenses/

     TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

     1. Definitions.

        "License" shall mean the terms and conditions for use, reproduction,
        and distribution as defined by Sections 1 through 9 of this document.

        "Licensor" shall mean the copyright owner or entity authorized by
        the copyright owner that is granting the License.

        "Legal Entity" shall mean the union of the acting entity and all
        other entities that control, are controlled by, or are under common
        control with that entity. For the purposes of this definition,
        "control" means (i) the power, direct or indirect, to cause the
        direction or management of such entity, whether by contract or
        otherwise, or (ii) ownership of fifty percent (50%) or more of the
        outstanding shares, or (iii) beneficial ownership of such entity.

        "You" (or "Your") shall mean an individual or Legal Entity
        exercising permissions granted by this License.

        "Source" form shall mean the preferred form for making modifications,
        including but not limited to software source code, documentation
        source, and configuration files.

        "Object" form shall mean any form resulting from mechanical
        transformation or translation of a Source form, including but
        not limited to compiled object code, generated documentation,
        and conversions to other media types.

        "Work" shall mean the work of authorship, whether in Source or
        Object form, made available under the License, as indicated by a
        copyright notice that is included in or attached to the work
        (an example is provided in the Appendix below).

        "Derivative Works" shall mean any work, whether in Source or Object
        form, that is based on (or derived from) the Work and for which the
        editorial revisions, annotations, elaborations, or other modifications
        represent, as a whole, an original work of authorship. For the purposes
        of this License, Derivative Works shall not include works that remain
        separable from, or merely link (or bind by name) to the interfaces of,
        the Work and Derivative Works thereof.

        "Contribution" shall mean any work of authorship, including
        the original version of the Work and any modifications or additions
        to that Work or Derivative Works thereof, that is intentionally
        submitted to Licensor for inclusion in the Work by the copyright owner
        or by an individual or Legal Entity authorized to submit on behalf of
        the copyright owner. For the purposes of this definition, "submitted"
        means any form of electronic, verbal, or written communication sent
        to the Licensor or its representatives, including but not limited to
        communication on electronic mailing lists, source code control systems,
        and issue tracking systems that are managed by, or on behalf of, the
        Licensor for the purpose of discussing and improving the Work, but
        excluding communication that is conspicuously marked or otherwise
        designated in writing by the copyright owner as "Not a Contribution."

        "Contributor" shall mean Licensor and any individual or Legal Entity
        on behalf of whom a Contribution has been received by Licensor and
        subsequently incorporated within the Work.

     2. Grant of Copyright License. Subject to the terms and conditions of
        this License, each Contributor hereby grants to You a perpetual,
        worldwide, non-exclusive, no-charge, royalty-free, irrevocable
        copyright license to reproduce, prepare Derivative Works of,
        publicly display, publicly perform, sublicense, and distribute the
        Work and such Derivative Works in Source or Object form.

     3. Grant of Patent License. Subject to the terms and conditions of
        this License, each Contributor hereby grants to You a perpetual,
        worldwide, non-exclusive, no-charge, royalty-free, irrevocable
        (except as stated in this section) patent license to make, have made,
        use, offer to sell, sell, import, and otherwise transfer the Work,
        where such license applies only to those patent claims licensable
        by such Contributor that are necessarily infringed by their
        Contribution(s) alone or by combination of their Contribution(s)
        with the Work to which such Contribution(s) was submitted. If You
        institute patent litigation against any entity (including a
        cross-claim or counterclaim in a lawsuit) alleging that the Work
        or a Contribution incorporated within the Work constitutes direct
        or contributory patent infringement, then any patent licenses
        granted to You under this License for that Work shall terminate
        as of the date such litigation is filed.

     4. Redistribution. You may reproduce and distribute copies of the
        Work or Derivative Works thereof in any medium, with or without
        modifications, and in Source or Object form, provided that You
        meet the following conditions:

        (a) You must give any other recipients of the Work or
            Derivative Works a copy of this License; and

        (b) You must cause any modified files to carry prominent notices
            stating that You changed the files; and

        (c) You must retain, in the Source form of any Derivative Works
            that You distribute, all copyright, patent, trademark, and
            attribution notices from the Source form of the Work,
            excluding those notices that do not pertain to any part of
            the Derivative Works; and

        (d) If the Work includes a "NOTICE" text file as part of its
            distribution, then any Derivative Works that You distribute must
            include a readable copy of the attribution notices contained
            within such NOTICE file, excluding those notices that do not
            pertain to any part of the Derivative Works, in at least one
            of the following places: within a NOTICE text file distributed
            as part of the Derivative Works; within the Source form or
            documentation, if provided along with the Derivative Works; or,
            within a display generated by the Derivative Works, if and
            wherever such third-party notices normally appear. The contents
            of the NOTICE file are for informational purposes only and
            do not modify the License. You may add Your own attribution
            notices within Derivative Works that You distribute, alongside
            or as an addendum to the NOTICE text from the Work, provided
            that such additional attribution notices cannot be construed
            as modifying the License.

        You may add Your own copyright statement to Your modifications and
        may provide additional or different license terms and conditions
        for use, reproduction, or distribution of Your modifications, or
        for any such Derivative Works as a whole, provided Your use,
        reproduction, and distribution of the Work otherwise complies with
        the conditions stated in this License.

     5. Submission of Contributions. Unless You explicitly state otherwise,
        any Contribution intentionally submitted for inclusion in the Work
        by You to the Licensor shall be under the terms and conditions of
        this License, without any additional terms or conditions.
        Notwithstanding the above, nothing herein shall supersede or modify
        the terms of any separate license agreement you may have executed
        with Licensor regarding such Contributions.

     6. Trademarks. This License does not grant permission to use the trade
        names, trademarks, service marks, or product names of the Licensor,
        except as required for reasonable and customary use in describing the
        origin of the Work and reproducing the content of the NOTICE file.

     7. Disclaimer of Warranty. Unless required by applicable law or
        agreed to in writing, Licensor provides the Work (and each
        Contributor provides its Contributions) on an "AS IS" BASIS,
        WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
        implied, including, without limitation, any warranties or conditions
        of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
        PARTICULAR PURPOSE. You are solely responsible for determining the
        appropriateness of using or redistributing the Work and assume any
        risks associated with Your exercise of permissions under this License.

     8. Limitation of Liability. In no event and under no legal theory,
        whether in tort (including negligence), contract, or otherwise,
        unless required by applicable law (such as deliberate and grossly
        negligent acts) or agreed to in writing, shall any Contributor be
        liable to You for damages, including any direct, indirect, special,
        incidental, or consequential damages of any character arising as a
        result of this License or out of the use or inability to use the
        Work (including but not limited to damages for loss of goodwill,
        work stoppage, computer failure or malfunction, or any and all
        other commercial damages or losses), even if such Contributor
        has been advised of the possibility of such damages.

     9. Accepting Warranty or Additional Liability. While redistributing
        the Work or Derivative Works thereof, You may choose to offer,
        and charge a fee for, acceptance of support, warranty, indemnity,
        or other liability obligations and/or rights consistent with this
        License. However, in accepting such obligations, You may act only
        on Your own behalf and on Your sole responsibility, not on behalf
        of any other Contributor, and only if You agree to indemnify,
        defend, and hold each Contributor harmless for any liability
        incurred by, or claims asserted against, such Contributor by reason
        of your accepting any such warranty or additional liability.

     END OF TERMS AND CONDITIONS

     APPENDIX: How to apply the Apache License to your work.

        To apply the Apache License to your work, attach the following
        boilerplate notice, with the fields enclosed by brackets "{}"
        replaced with your own identifying information. (Don't include
        the brackets!)  The text should be enclosed in the appropriate
        comment syntax for the file format. We also recommend that a
        file or class name and description of purpose be included on the
        same "printed page" as the copyright notice for easier
        identification within third-party archives.

     Copyright {yyyy} {name of copyright owner}

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
  */

  SVD.svd = function (A) {
    this.U = null;
    this.V = null;
    this.s = null;
    this.m = 0;
    this.n = 0;
    this.m = A.length;
    this.n = A[0].length;
    let nu = Math.min(this.m, this.n);
    this.s = (function (s) {
      let a = [];
      while (s-- > 0)
        a.push(0);
      return a;
    })(Math.min(this.m + 1, this.n));
    this.U = (function (dims) {
      let allocate = function (dims) {
        if (dims.length == 0) {
          return 0;
        } else {
          let array = [];
          for (let i = 0; i < dims[0]; i++) {
            array.push(allocate(dims.slice(1)));
          }
          return array;
        }
      };
      return allocate(dims);
    })([this.m, nu]);
    this.V = (function (dims) {
      let allocate = function (dims) {
        if (dims.length == 0) {
          return 0;
        } else {
          let array = [];
          for (let i = 0; i < dims[0]; i++) {
            array.push(allocate(dims.slice(1)));
          }
          return array;
        }
      };
      return allocate(dims);
    })([this.n, this.n]);
    let e = (function (s) {
      let a = [];
      while (s-- > 0)
        a.push(0);
      return a;
    })(this.n);
    let work = (function (s) {
      let a = [];
      while (s-- > 0)
        a.push(0);
      return a;
    })(this.m);
    let wantu = true;
    let nct = Math.min(this.m - 1, this.n);
    let nrt = Math.max(0, Math.min(this.n - 2, this.m));
    for (let k = 0; k < Math.max(nct, nrt); k++) {
      if (k < nct) {
        this.s[k] = 0;
        for (let i = k; i < this.m; i++) {
          this.s[k] = SVD.hypot(this.s[k], A[i][k]);
        }
        if (this.s[k] !== 0.0) {
          if (A[k][k] < 0.0) {
            this.s[k] = -this.s[k];
          }
          for (let i = k; i < this.m; i++) {
            A[i][k] /= this.s[k];
          }
          A[k][k] += 1.0;
        }
        this.s[k] = -this.s[k];
      }
      for (let j = k + 1; j < this.n; j++) {
        if ((function (lhs, rhs) {
          return lhs && rhs;
        })((k < nct), (this.s[k] !== 0.0))) {
          let t = 0;
          for (let i = k; i < this.m; i++) {
            t += A[i][k] * A[i][j];
          }
          t = -t / A[k][k];
          for (let i = k; i < this.m; i++) {
            A[i][j] += t * A[i][k];
          }
        }
        e[j] = A[k][j];
      }
      if ((function (lhs, rhs) {
        return lhs && rhs;
      })(wantu, (k < nct))) {
        for (let i = k; i < this.m; i++) {
          this.U[i][k] = A[i][k];
        }
      }
      if (k < nrt) {
        e[k] = 0;
        for (let i = k + 1; i < this.n; i++) {
          e[k] = SVD.hypot(e[k], e[i]);
        }
        if (e[k] !== 0.0) {
          if (e[k + 1] < 0.0) {
            e[k] = -e[k];
          }
          for (let i = k + 1; i < this.n; i++) {
            e[i] /= e[k];
          }
          e[k + 1] += 1.0;
        }
        e[k] = -e[k];
        if ((function (lhs, rhs) {
          return lhs && rhs;
        })((k + 1 < this.m), (e[k] !== 0.0))) {
          for (let i = k + 1; i < this.m; i++) {
            work[i] = 0.0;
          }
          for (let j = k + 1; j < this.n; j++) {
            for (let i = k + 1; i < this.m; i++) {
              work[i] += e[j] * A[i][j];
            }
          }
          for (let j = k + 1; j < this.n; j++) {
            let t = -e[j] / e[k + 1];
            for (let i = k + 1; i < this.m; i++) {
              A[i][j] += t * work[i];
            }
          }
        }
        {
          for (let i = k + 1; i < this.n; i++) {
            this.V[i][k] = e[i];
          }      }
      }
    }  let p = Math.min(this.n, this.m + 1);
    if (nct < this.n) {
      this.s[nct] = A[nct][nct];
    }
    if (this.m < p) {
      this.s[p - 1] = 0.0;
    }
    if (nrt + 1 < p) {
      e[nrt] = A[nrt][p - 1];
    }
    e[p - 1] = 0.0;
    {
      for (let j = nct; j < nu; j++) {
        for (let i = 0; i < this.m; i++) {
          this.U[i][j] = 0.0;
        }
        this.U[j][j] = 1.0;
      }    for (let k = nct - 1; k >= 0; k--) {
        if (this.s[k] !== 0.0) {
          for (let j = k + 1; j < nu; j++) {
            let t = 0;
            for (let i = k; i < this.m; i++) {
              t += this.U[i][k] * this.U[i][j];
            }          t = -t / this.U[k][k];
            for (let i = k; i < this.m; i++) {
              this.U[i][j] += t * this.U[i][k];
            }        }        for (let i = k; i < this.m; i++) {
            this.U[i][k] = -this.U[i][k];
          }        this.U[k][k] = 1.0 + this.U[k][k];
          for (let i = 0; i < k - 1; i++) {
            this.U[i][k] = 0.0;
          }      } else {
          for (let i = 0; i < this.m; i++) {
            this.U[i][k] = 0.0;
          }        this.U[k][k] = 1.0;
        }
      }  }
    {
      for (let k = this.n - 1; k >= 0; k--) {
        if ((function (lhs, rhs) {
          return lhs && rhs;
        })((k < nrt), (e[k] !== 0.0))) {
          for (let j = k + 1; j < nu; j++) {
            let t = 0;
            for (let i = k + 1; i < this.n; i++) {
              t += this.V[i][k] * this.V[i][j];
            }          t = -t / this.V[k + 1][k];
            for (let i = k + 1; i < this.n; i++) {
              this.V[i][j] += t * this.V[i][k];
            }        }      }
        for (let i = 0; i < this.n; i++) {
          this.V[i][k] = 0.0;
        }      this.V[k][k] = 1.0;
      }  }
    let pp = p - 1;
    let eps = Math.pow(2.0, -52.0);
    let tiny = Math.pow(2.0, -966.0);
    while ((p > 0)) {
      let k = void 0;
      let kase = void 0;
      for (k = p - 2; k >= -1; k--) {
        if (k === -1) {
          break;
        }
        if (Math.abs(e[k]) <= tiny + eps * (Math.abs(this.s[k]) + Math.abs(this.s[k + 1]))) {
          e[k] = 0.0;
          break;
        }
      }    if (k === p - 2) {
        kase = 4;
      } else {
        let ks = void 0;
        for (ks = p - 1; ks >= k; ks--) {
          if (ks === k) {
            break;
          }
          let t = (ks !== p ? Math.abs(e[ks]) : 0.0) + (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0.0);
          if (Math.abs(this.s[ks]) <= tiny + eps * t) {
            this.s[ks] = 0.0;
            break;
          }
        }      if (ks === k) {
          kase = 3;
        } else if (ks === p - 1) {
          kase = 1;
        } else {
          kase = 2;
          k = ks;
        }
      }
      k++;
      switch ((kase)) {
        case 1:
          {
            let f = e[p - 2];
            e[p - 2] = 0.0;
            for (let j = p - 2; j >= k; j--) {
              let t = SVD.hypot(this.s[j], f);
              let cs = this.s[j] / t;
              let sn = f / t;
              this.s[j] = t;
              if (j !== k) {
                f = -sn * e[j - 1];
                e[j - 1] = cs * e[j - 1];
              }
              {
                for (let i = 0; i < this.n; i++) {
                  t = cs * this.V[i][j] + sn * this.V[i][p - 1];
                  this.V[i][p - 1] = -sn * this.V[i][j] + cs * this.V[i][p - 1];
                  this.V[i][j] = t;
                }            }
            }        }        break;
        case 2:
          {
            let f = e[k - 1];
            e[k - 1] = 0.0;
            for (let j = k; j < p; j++) {
              let t = SVD.hypot(this.s[j], f);
              let cs = this.s[j] / t;
              let sn = f / t;
              this.s[j] = t;
              f = -sn * e[j];
              e[j] = cs * e[j];
              {
                for (let i = 0; i < this.m; i++) {
                  t = cs * this.U[i][j] + sn * this.U[i][k - 1];
                  this.U[i][k - 1] = -sn * this.U[i][j] + cs * this.U[i][k - 1];
                  this.U[i][j] = t;
                }            }
            }        }        break;
        case 3:
          {
            let scale = Math.max(Math.max(Math.max(Math.max(Math.abs(this.s[p - 1]), Math.abs(this.s[p - 2])), Math.abs(e[p - 2])), Math.abs(this.s[k])), Math.abs(e[k]));
            let sp = this.s[p - 1] / scale;
            let spm1 = this.s[p - 2] / scale;
            let epm1 = e[p - 2] / scale;
            let sk = this.s[k] / scale;
            let ek = e[k] / scale;
            let b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2.0;
            let c = (sp * epm1) * (sp * epm1);
            let shift = 0.0;
            if ((function (lhs, rhs) {
              return lhs || rhs;
            })((b !== 0.0), (c !== 0.0))) {
              shift = Math.sqrt(b * b + c);
              if (b < 0.0) {
                shift = -shift;
              }
              shift = c / (b + shift);
            }
            let f = (sk + sp) * (sk - sp) + shift;
            let g = sk * ek;
            for (let j = k; j < p - 1; j++) {
              let t = SVD.hypot(f, g);
              let cs = f / t;
              let sn = g / t;
              if (j !== k) {
                e[j - 1] = t;
              }
              f = cs * this.s[j] + sn * e[j];
              e[j] = cs * e[j] - sn * this.s[j];
              g = sn * this.s[j + 1];
              this.s[j + 1] = cs * this.s[j + 1];
              {
                for (let i = 0; i < this.n; i++) {
                  t = cs * this.V[i][j] + sn * this.V[i][j + 1];
                  this.V[i][j + 1] = -sn * this.V[i][j] + cs * this.V[i][j + 1];
                  this.V[i][j] = t;
                }            }
              t = SVD.hypot(f, g);
              cs = f / t;
              sn = g / t;
              this.s[j] = t;
              f = cs * e[j] + sn * this.s[j + 1];
              this.s[j + 1] = -sn * e[j] + cs * this.s[j + 1];
              g = sn * e[j + 1];
              e[j + 1] = cs * e[j + 1];
              if ((j < this.m - 1)) {
                for (let i = 0; i < this.m; i++) {
                  t = cs * this.U[i][j] + sn * this.U[i][j + 1];
                  this.U[i][j + 1] = -sn * this.U[i][j] + cs * this.U[i][j + 1];
                  this.U[i][j] = t;
                }            }
            }          e[p - 2] = f;
          }        break;
        case 4:
          {
            if (this.s[k] <= 0.0) {
              this.s[k] = (this.s[k] < 0.0 ? -this.s[k] : 0.0);
              {
                for (let i = 0; i <= pp; i++) {
                  this.V[i][k] = -this.V[i][k];
                }            }
            }
            while ((k < pp)) {
              if (this.s[k] >= this.s[k + 1]) {
                break;
              }
              let t = this.s[k];
              this.s[k] = this.s[k + 1];
              this.s[k + 1] = t;
              if ((k < this.n - 1)) {
                for (let i = 0; i < this.n; i++) {
                  t = this.V[i][k + 1];
                  this.V[i][k + 1] = this.V[i][k];
                  this.V[i][k] = t;
                }            }
              if ((k < this.m - 1)) {
                for (let i = 0; i < this.m; i++) {
                  t = this.U[i][k + 1];
                  this.U[i][k + 1] = this.U[i][k];
                  this.U[i][k] = t;
                }            }
              k++;
            }          p--;
          }        break;
      }
    }  let result = {U: this.U, V: this.V, S: this.s};
    return result;
  };
          
  // sqrt(a^2 + b^2) without under/overflow.
  SVD.hypot = function(a, b) {
     let r;
     if (Math.abs(a) > Math.abs(b)) {
        r = b/a;
        r = Math.abs(a)*Math.sqrt(1+r*r);
     } else if (b != 0) {
        r = a/b;
        r = Math.abs(b)*Math.sqrt(1+r*r);
     } else {
        r = 0.0;
     }
     return r;
  };

  function mergeSplit(cy, options) {
    
    // API to be returned
    let api = {};

    // merge given component1 to component2 based on common nodes
    api.merge = function(sourceComponent, targetComponent){
      
      // find common nodes and edges
      let sourceToTargetMap = new Map();
      // construct common nodes map based on matched nodes
      sourceComponent.nodes().forEach(node1 => {
        targetComponent.nodes().forEach(node2 => {
          if(options.nodeMatcher(node1, node2)) {
            sourceToTargetMap.set(node1.id(), node2.id()); 
          }
        });
      });

      cy.style()
        .selector('node.commonNode')
          .style({
            'background-color': '#ff0000'
          }).update();  

      sourceToTargetMap.forEach((value, key) => {
        cy.getElementById(key).addClass("commonNode");
        cy.getElementById(value).addClass("commonNode");
      });

      // calculate transformation matrix
      let transformationMatrix;

      if (sourceToTargetMap.size == 1) {  // there is one common node, so check overlap of current and reflected versions
        const targetBB = targetComponent.boundingBox({ includeLabels: false, includeOverlays: false });
        const transforms = [
          { name: "identity", fn: (x, y, cx, cy) => ({ x, y }) },
          { name: "flipX", fn: (x, y, cx, cy) => ({ x, y: 2*cy - y }) },
          { name: "flipY", fn: (x, y, cx, cy) => ({ x: 2*cx - x, y }) }
        ];
        const mapItem = sourceToTargetMap.entries().next().value;
        const sourceNode = cy.getElementById(mapItem[0]);
        const targetNode = cy.getElementById(mapItem[1]);
        const shiftAmount = {x: targetNode.position().x - sourceNode.position().x, y: targetNode.position().y - sourceNode.position().y};

        let best = Infinity;
        let bestTransform = null;

        for (const t of transforms) {
          const score = scoreTransform(sourceComponent.nodes(), targetBB, t.fn, shiftAmount, sourceNode);

          if (score < best) {
            best = score;
            bestTransform = t.name;
          }
        }
        if (bestTransform == "identity") {
          transformationMatrix = [[1, 0], [0, 1]];
        } else if (bestTransform == "flipX"){
          transformationMatrix = [[1, 0], [0, -1]];
        } else {
          transformationMatrix = [[-1, 0], [0, 1]];
        }
        console.log(bestTransform);
      } else {  // common nodes are more than one
        transformationMatrix = calcTransformationMatrix(sourceToTargetMap);
      }

      let sourceBBox = sourceComponent.boundingBox({includeLabels: false, includeOverlays: false});
      let sourceBBoxCenter = {x: sourceBBox.x1 + sourceBBox.w / 2, y: sourceBBox.y1 + sourceBBox.h / 2};

      let transformationResult = [];
      /* apply found transformation matrix to sourceBBox component */
      for (let i = 0; i < sourceComponent.nodes().length; i++) {
        let node = sourceComponent.nodes()[i];
        let nodePosition = node.position();
        let localX = nodePosition.x - sourceBBoxCenter.x;
        let localY = nodePosition.y - sourceBBoxCenter.y;
        let temp1 = [localX, localY];
        let temp2 = [transformationMatrix[0][0], transformationMatrix[1][0]];
        let temp3 = [transformationMatrix[0][1], transformationMatrix[1][1]];
        transformationResult.push({x: helper.dotProduct(temp1, temp2) + sourceBBoxCenter.x, y: helper.dotProduct(temp1, temp3) + sourceBBoxCenter.y});
      }

      let aniArray = [];
      for (let i = 0; i < sourceComponent.nodes().length; i++) {
        let node = sourceComponent.nodes()[i];
        let nodeAni = node.animation({
          position: transformationResult[i],
          queue: true
        }, {
          duration: options.animationDuration
        });
        aniArray.push(nodeAni);
      }

      setTimeout(function(){
        aniArray.forEach(ani => {
          ani.play();
        });
      }, 100);

      // expant target component
      let ani3Array = [];
      setTimeout(function(){
        ani3Array = expandTarget(targetComponent, sourceComponent, sourceToTargetMap, options);
        ani3Array[0].forEach(ani => {
          ani.play();
        });
      }, 4000);

      setTimeout(function(){
        ani3Array[1].forEach(ani => {
          ani.play();
        });
      }, 6000);

      // merge source component to target
      setTimeout(function(){
        integrateSourceBBoxToTarget(sourceToTargetMap);
      }, 8000); 

    };

    // split function - splits given component from the rest of the graph
    api.split = function(component, keepBoundaryEles = true, direction = "auto", offset = 100) {
      let restOfGraph = cy.elements().difference(component);

      let splittedComponent = cy.collection();
      let boundaryNodes = undefined;
      let edgesToRemove = undefined;
      // keep boundary elements
      if (keepBoundaryEles) {
        // find the nodes that need to be split
        boundaryNodes = component.nodes().filter(node => {
          let filter = false;
          let edgesConnectedToBoundary = node.edgesWith(restOfGraph);
          if(edgesConnectedToBoundary.length > 0) {
            filter = true;
          }
          return filter;
        });

        let boundaryNodesJsons = boundaryNodes.jsons();
        let { jsons: clonedNodesJsons, oldIdToNewId} = cloneNodes(boundaryNodesJsons);

        let clonedNodes = cy.collection();
        cy.batch(function () {
            clonedNodes = cy.add(clonedNodesJsons);
            //clonedNodes.select();
        });
        // process edges between boundary nodes and given separated component
        // cloned nodes and edges stay on separated component side
        let edgesToEvaluate = boundaryNodes.edgesWith(component);
        let boundaryEdges = cy.collection();
        let clonedEdges = cy.collection();
        edgesToEvaluate.forEach(edge => {
          if(oldIdToNewId[edge.source().id()] && !oldIdToNewId[edge.target().id()]) {
            edge.move({
              source: oldIdToNewId[edge.source().id()]
            });
          }
          if(oldIdToNewId[edge.target().id()] && !oldIdToNewId[edge.source().id()]) {
            edge.move({
              target: oldIdToNewId[edge.target().id()]
            });
          }
          if(oldIdToNewId[edge.source().id()] && oldIdToNewId[edge.target().id()]) {
            let boundaryEdgesJsons = edge.jsons(); // we process a single edge, but cloneEdges function gets jsons
            let result = cloneEdges(boundaryEdgesJsons, oldIdToNewId);
            let clonedEdgeJson = result.jsons[0];
            let clonedEdge = cy.add(clonedEdgeJson);
            boundaryEdges.merge(edge);
            clonedEdges.merge(clonedEdge);     
          }
        });

        splittedComponent = cy.collection().merge(component.not(boundaryNodes).not(boundaryEdges)).merge(clonedNodes).merge(clonedEdges);
        // cy.elements().not(splittedComponent).unselect();
      } else {	// ignore boundary nodes
        edgesToRemove = component.edgesWith(restOfGraph);
        splittedComponent.merge(component.not(edgesToRemove));
        edgesToRemove.remove();
        //console.log(splittedComponent);
      }

      if(direction != "none") {
        // calculate overall shift amount
        let shiftAmountX = 0;
        let shiftAmountY = 0;
        let splittedBBox = splittedComponent.boundingBox();
        let restBBox;
        if (splittedComponent.parent() && splittedComponent.parent().length > 0) { // we may need to find topMostParent here
          restBBox = splittedComponent.parent()[0].descendants().not(splittedComponent).boundingBox();
        } else {
          restBBox = restOfGraph.boundingBox();
        }
        // if auto, then decide split direction based on distance from center of restOfGraph - longer is better
        if (direction == "auto") { 
          let diffInX = (restBBox.x1 + restBBox.w / 2) - (splittedBBox.x1 + splittedBBox.w / 2);
          let diffInY = (restBBox.y1 + restBBox.h / 2) - (splittedBBox.y1 + splittedBBox.h / 2);
          if (Math.abs(diffInX) > Math.abs(diffInY)) {
            if (diffInX >= 0) {
              direction = "left";
            } else {
              direction = "right";
            }
          } else {
             if (diffInY >= 0) {
              direction = "up";
            } else {
              direction = "down";
            }         
          }
        } 
        if (direction == "left") {
          shiftAmountX = (restBBox.x1 - splittedBBox.w / 2 - offset) - (splittedBBox.x1 + splittedBBox.w / 2);
          shiftAmountY = (restBBox.y1 + restBBox.h / 2) - (splittedBBox.y1 + splittedBBox.h / 2);
        } else if (direction == "right") {
          shiftAmountX = (restBBox.x1 + restBBox.w + splittedBBox.w / 2 + offset) - (splittedBBox.x1 + splittedBBox.w / 2);
          shiftAmountY = (restBBox.y1 + restBBox.h / 2) - (splittedBBox.y1 + splittedBBox.h / 2);        
        } else if (direction == "up") {
          shiftAmountX =(restBBox.x1 + restBBox.w / 2) - (splittedBBox.x1 + splittedBBox.w / 2);
          shiftAmountY = (restBBox.y1 - splittedBBox.h / 2 - offset) - (splittedBBox.y1 + splittedBBox.h / 2);
        } else if (direction == "down") {
          shiftAmountX =(restBBox.x1 + restBBox.w / 2) - (splittedBBox.x1 + splittedBBox.w / 2);
          shiftAmountY = (restBBox.y1 + restBBox.h + splittedBBox.h / 2 + offset) - (splittedBBox.y1 + splittedBBox.h / 2);
        }
        if(options.animate) { // animate nodes to calculated position
          splittedComponent.nodes().forEach(node => {
            node.animate({
              position: ({x: node.position().x + shiftAmountX, y: node.position().y + shiftAmountY}),
              duration: options.animationDuration
            });
          });
        } else { // move nodes to calculated position without animation
          splittedComponent.nodes().shift({ x: shiftAmountX, y: shiftAmountY }); 
        }
      }

      return splittedComponent;
    };

    return api;
  }

  // computes bounding box for given node positions by not considering node dimensions
  function computeBB(transformed) {
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    transformed.forEach(p => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });

    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  }

  // calculates intersection area
  function intersectionArea(a, b) {
    const x1 = Math.max(a.x1, b.x1);
    const y1 = Math.max(a.y1, b.y1);
    const x2 = Math.min(a.x2, b.x2);
    const y2 = Math.min(a.y2, b.y2);

    if (x2 <= x1 || y2 <= y1) return 0;

    return (x2 - x1) * (y2 - y1);
  }

  // returns intersection area for given transformation and shift
  function scoreTransform(sourceNodes, targetBB, transformFn, anchorShift, anchorNode) {
    const { x: cx, y: cy } = anchorNode.position();
    let transformed = sourceNodes.map(n => {
      let { x, y } = n.position();

      ({ x, y } = transformFn(x, y, cx, cy));

      return {
        x: x + anchorShift.x,
        y: y + anchorShift.y
      };
    });

    const bb = computeBB(transformed);

    return intersectionArea(bb, targetBB);
  }

  // given sourceToTargetMap which contains mapping between common nodes in both components
  // calculate transformation matrix
  function calcTransformationMatrix (sourceToTargetMap) {
    // construct source and target configurations
    let targetMatrix = []; // A - target configuration
    let sourceMatrix = []; // B - source configuration 

    sourceToTargetMap.forEach((value, key) => {
      let targetPosition = cy.getElementById(value).position();
      targetMatrix.push([targetPosition.x, targetPosition.y]);

      let sourcePosition = cy.getElementById(key).position();
      sourceMatrix.push([sourcePosition.x, sourcePosition.y]);
    });

    // calculate transformation matrix
    let transformationMatrix;
    let targetMatrixTranspose = helper.transpose(targetMatrix);  // A'
    let sourceMatrixTranspose = helper.transpose(sourceMatrix);  // B'

    // centralize transpose matrices
    for (let i = 0; i < targetMatrixTranspose.length; i++) {
      targetMatrixTranspose[i] = helper.multGamma(targetMatrixTranspose[i]);
      sourceMatrixTranspose[i] = helper.multGamma(sourceMatrixTranspose[i]);
    }

    // do actual calculation for transformation matrix
    let tempMatrix = helper.multMat(targetMatrixTranspose, helper.transpose(sourceMatrixTranspose)); // tempMatrix = A'B
    let SVDResult = SVD.svd(tempMatrix); // SVD(A'B) = USV', svd function returns U, S and V 
    transformationMatrix = helper.multMat(SVDResult.V, helper.transpose(SVDResult.U)); // transformationMatrix = T = VU'

    // to prevent floating-point precision errors 
    transformationMatrix = transformationMatrix.map(inner =>
      inner.map(n => Number(n.toFixed(1)))
    );

    return transformationMatrix;
  }

  function expandTarget(targetComponent, sourceComponent, sourceToTargetMap, options) {
    let targetCommonNodeSet = cy.collection();
    let sourceBBoxCommonNodeSet = cy.collection();
    sourceToTargetMap.forEach((value, key) => {
      targetCommonNodeSet.merge(cy.getElementById(value));
      sourceBBoxCommonNodeSet.merge(cy.getElementById(key));
    });

    let bbTargetCommon = targetCommonNodeSet.boundingBox({includeLabels: false, includeOverlays: false});
    let bbsourceBBoxCommon = sourceBBoxCommonNodeSet.boundingBox({includeLabels: false, includeOverlays: false});
    let bbDiff = {x: (bbTargetCommon.x1 + bbTargetCommon.w / 2) - (bbsourceBBoxCommon.x1 + bbsourceBBoxCommon.w / 2), y: (bbTargetCommon.y1 + bbTargetCommon.h / 2) - (bbsourceBBoxCommon.y1 + bbsourceBBoxCommon.h / 2)};

    sourceBBoxCommonNodeSet.forEach(node => {
      node.scratch('position', {x: node.position().x + bbDiff.x, y: node.position().y + bbDiff.y});
    });

    let minXNode, maxXNode, minYNode, maxYNode = 0;
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    sourceBBoxCommonNodeSet.forEach((node, i) => {
      let nodeTempPos = node.scratch('position');
      if(nodeTempPos.x < minX) {
        minXNode = node;
        minX = nodeTempPos.x;
      }
      if(nodeTempPos.x > maxX) {
        maxXNode = node;
        maxX = nodeTempPos.x;
      }
      if(nodeTempPos.y < minY) {
        minYNode = node;
        minY = nodeTempPos.y;
      }
      if(nodeTempPos.y > maxY) {
        maxYNode = node;
        maxY = nodeTempPos.y;
      }
    });
    
    let upShiftAmount = cy.getElementById(sourceToTargetMap.get(minYNode.id())).position().y - minY;
    let downShiftAmount = maxY - cy.getElementById(sourceToTargetMap.get(maxYNode.id())).position().y;
    let leftShiftAmount = cy.getElementById(sourceToTargetMap.get(minXNode.id())).position().x - minX;
    let rightShiftAmount = maxX - cy.getElementById(sourceToTargetMap.get(maxXNode.id())).position().x;

    targetComponent.nodes().forEach(node => {
      node.scratch('newPosition', {x: node.position().x, y: node.position().y});
      if(node.position().y <= cy.getElementById(sourceToTargetMap.get(minYNode.id())).position().y) {
        node.scratch('newPosition', {x: node.scratch('newPosition').x, y: node.scratch('newPosition').y - upShiftAmount});
      }
      if(node.position().y >= cy.getElementById(sourceToTargetMap.get(maxYNode.id())).position().y) {
        node.scratch('newPosition', {x: node.scratch('newPosition').x, y: node.scratch('newPosition').y + downShiftAmount});
      }
      if(node.position().x <= cy.getElementById(sourceToTargetMap.get(minXNode.id())).position().x) {
        node.scratch('newPosition', {x: node.scratch('newPosition').x - leftShiftAmount, y: node.scratch('newPosition').y});
      }
      if(node.position().x >= cy.getElementById(sourceToTargetMap.get(maxXNode.id())).position().x) {
        node.scratch('newPosition', {x: node.scratch('newPosition').x + rightShiftAmount, y: node.scratch('newPosition').y});
      }
    });

    let animations1 = [];
    targetComponent.nodes().forEach(node => {
      let ani = node.animation({
        position: node.scratch('newPosition'),
        queue: true
      }, {
        duration: options.animationDuration
      });
      animations1.push(ani);
    });

    let animations2 = [];
    sourceComponent.nodes().forEach(node => {
      let ani = node.animation({
        position: {x: node.position().x + bbDiff.x, y: node.position().y + bbDiff.y},
        queue: true
      }, {
        duration: options.animationDuration
      });
      animations2.push(ani);    
    });
    return [animations1, animations2];
  }

  function integrateSourceBBoxToTarget(sourceToTargetMap) {
    sourceToTargetMap.forEach((value, key) => {
      let sourceBBoxNode = cy.getElementById(key);
      cy.getElementById(value);
      sourceBBoxNode.incomers().edges().forEach(edge => {
        if(!(sourceToTargetMap.get(edge.source().id()) && sourceToTargetMap.get(edge.target().id()) && cy.getElementById(sourceToTargetMap.get(edge.source().id())).edgesTo(cy.getElementById(sourceToTargetMap.get(edge.target().id())).length != 0))){
          edge.move({
            target: value
          });
        }
      });
      sourceBBoxNode.outgoers().edges().forEach(edge => {
        if(!(sourceToTargetMap.get(edge.source().id()) && sourceToTargetMap.get(edge.target().id()) && cy.getElementById(sourceToTargetMap.get(edge.source().id())).edgesTo(cy.getElementById(sourceToTargetMap.get(edge.target().id())).length != 0))){
          edge.move({
            source: value
          });
        }
      });
      sourceBBoxNode.remove();	// remove dangling node
    });
    cy.elements().unselect();
    //setTimeout(function(){
      sourceToTargetMap.forEach((value, key) => {
        cy.getElementById(value).removeClass("commonNode");
      });
    //}, 500); 
  }

  function cloneNodes(jsons) {
    jsons = structuredClone(jsons);

    let oldIdToNewId = {};
    for (let i = 0; i < jsons.length; i++) {
        let json = jsons[i];

        // change id of the cloned node
        let id = getCloneId("node");
        oldIdToNewId[json.data.id] = id;
        json.data.id = id;

        // change parent reference of the cloned node if parent is also cloned
        if (json.data["parent"] && oldIdToNewId[json.data["parent"]]) {
          json.data["parent"] = oldIdToNewId[json.data["parent"]];
        }
    }
    return {jsons, oldIdToNewId}; 
  }

  function cloneEdges(jsons, oldIdToNewId) {
    jsons = structuredClone(jsons);

    for (let i = 0; i < jsons.length; i++) {
        let json = jsons[i];

        // change id of the cloned edge
        let id = getCloneId("edge");
        oldIdToNewId[json.data.id] = id;
        json.data.id = id;

        const fields = ['source', 'target'];
        // change source/target references of the cloned edge (source and target must also be cloned)
        for (let k = 0; k < fields.length; k++) {
          let field = fields[k];
          if (json.data[field] && oldIdToNewId[json.data[field]])
              json.data[field] = oldIdToNewId[json.data[field]];
        }
    }
    return {jsons, oldIdToNewId}; 
  }

  function getCloneId(eleType) {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    let cloneIdTemp = s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    if (eleType == "node") {
      return 'n' + cloneIdTemp;
    } else if(eleType == "edge") {
      return 'e' + cloneIdTemp;
    } else {
      return cloneIdTemp;
    }

  }

  /**
   * cytoscape-merge-split
   * An extension to merge/split graph components while respecting the existing layout
   */

  function register(cytoscape) {
    if (!cytoscape) {
      return;
    } // can't register if cytoscape unspecified

    // Register the extension with cytoscape
    cytoscape("core", "mergeSplit", function(opts) {
      let cy = this;

      let options = {
        animate: true,
        animationDuration: 1000,
        nodeMatcher: (n1, n2) => {  // n1 from source component, n2 from target component
          // check if labels match
          return !!(n1.data('label') && n1.data('label') != '' && n2.data('label') && n2.data('label') != '' && n1.data('label') === n2.data('label'));
        },
        edgeMatcher: (e1, e2) => {  // e1 from source component, e2 from target component
          // check if source and target labels match
          return e1.source().data('label') === e2.source().data('label') &&
          e1.target().data('label') === e2.target().data('label')
        }
      };
      
      // If opts is not 'get' that is it is a real options object then initilize the extension
      if (opts !== 'get') {
        options = extendOptions(options, opts);

        let api = mergeSplit(cy, options);

        api.setOption = function(option, value) {
          let options = getScratch(cy, 'options');
          options[option] = value;
          setScratch(cy, 'options', options);
        };

        setScratch(cy, 'options', options);
        setScratch(cy, 'mergeSplit', api);
      }
      // Expose the API to the users
      return getScratch(cy, 'mergeSplit');
    });

    // Get the whole scratchpad reserved for this extension
    function getScratch(cyOrEle, name) {
      if (cyOrEle.scratch('cyComplexityManagement') === undefined) {
        cyOrEle.scratch('cyComplexityManagement', {});
      }

      var scratch = cyOrEle.scratch('cyComplexityManagement');
      var retVal = (name === undefined) ? scratch : scratch[name];
      return retVal;
    }

    // Set a single property on scratchpad of the core
    function setScratch(cyOrEle, name, val) {
      getScratch(cyOrEle)[name] = val;
    }

    function extendOptions(options, extendBy) {
      var tempOpts = {};
      for (var key in options)
        tempOpts[key] = options[key];

      for (var key in extendBy)
        if (tempOpts.hasOwnProperty(key))
          tempOpts[key] = extendBy[key];
      return tempOpts;
    }
  }

  if (typeof window.cytoscape !== 'undefined') {	// expose to global cytoscape (i.e. window.cytoscape)
    register(window.cytoscape);
  }

  return register;

}));
